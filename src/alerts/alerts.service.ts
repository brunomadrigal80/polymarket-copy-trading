import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PerformanceAlert, AlertType, AlertSeverity } from './entities/performance-alert.entity';
import { DashboardService } from '../dashboard/dashboard.service';

const FAIL_RATE_THRESHOLD_PERCENT = 15;
const COPY_RATE_LOW_THRESHOLD_PERCENT = 40;
const NO_TRADES_HOURS = 24;

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);
  private readonly store: PerformanceAlert[] = [];

  constructor(private readonly dashboard: DashboardService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async evaluatePerformanceAlerts(): Promise<void> {
    try {
      const stats = await this.dashboard.getStatsForAlerts();
      const { total, copied, failed, lastTradeAt } = stats;

      if (total === 0) {
        await this.createAlertIfNotExists(AlertType.NO_RECENT_TRADES, AlertSeverity.INFO, {
          message: 'No trades recorded yet. Add followed wallets to start copy trading.',
        });
        return;
      }

      const failRatePercent = (failed / total) * 100;
      const copyRatePercent = (copied / total) * 100;

      if (failRatePercent >= FAIL_RATE_THRESHOLD_PERCENT) {
        await this.createAlertIfNotExists(AlertType.HIGH_FAIL_RATE, AlertSeverity.CRITICAL, {
          message: `Fail rate is ${failRatePercent.toFixed(1)}% (threshold: ${FAIL_RATE_THRESHOLD_PERCENT}%). Check execution and API.`,
          failRatePercent,
          failed,
          total,
        });
      }

      if (copyRatePercent <= COPY_RATE_LOW_THRESHOLD_PERCENT && total >= 10) {
        await this.createAlertIfNotExists(AlertType.LOW_COPY_RATE, AlertSeverity.WARNING, {
          message: `Copy rate is ${copyRatePercent.toFixed(1)}% (below ${COPY_RATE_LOW_THRESHOLD_PERCENT}%). Many trades are being skipped.`,
          copyRatePercent,
          copied,
          total,
        });
      }

      if (lastTradeAt) {
        const hoursSinceLastTrade = (Date.now() - lastTradeAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastTrade >= NO_TRADES_HOURS) {
          await this.createAlertIfNotExists(AlertType.NO_RECENT_TRADES, AlertSeverity.WARNING, {
            message: `No new trades in the last ${Math.floor(hoursSinceLastTrade)} hours. Leaders may be inactive.`,
            lastTradeAt: lastTradeAt.toISOString(),
          });
        }
      }
    } catch (err) {
      this.logger.warn('Failed to evaluate performance alerts', err instanceof Error ? err.message : err);
    }
  }

  private async createAlertIfNotExists(
    type: AlertType,
    severity: AlertSeverity,
    payload: { message: string; [k: string]: unknown },
  ): Promise<void> {
    const recent = this.store
      .filter((a) => a.type === type && !a.read)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (recent) {
      const ageHours = (Date.now() - new Date(recent.createdAt).getTime()) / (1000 * 60 * 60);
      if (ageHours < 2) return; // avoid spam: same alert type within 2 hours
    }

    const alert: PerformanceAlert = {
      id: crypto.randomUUID(),
      type,
      severity,
      message: payload.message,
      metadata: payload,
      read: false,
      createdAt: new Date(),
    };
    this.store.push(alert);
    this.logger.log(`Alert created: ${type} - ${payload.message}`);
  }

  async findAll(unreadOnly = false): Promise<PerformanceAlert[]> {
    let list = [...this.store].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (unreadOnly) list = list.filter((a) => !a.read);
    return list.slice(0, 100);
  }

  async markAsRead(id: string): Promise<PerformanceAlert> {
    const alert = this.store.find((a) => a.id === id);
    if (!alert) throw new Error('Alert not found');
    alert.read = true;
    return alert;
  }

  async markAllAsRead(): Promise<{ count: number }> {
    const count = this.store.filter((a) => !a.read).length;
    this.store.forEach((a) => (a.read = true));
    return { count };
  }
}
