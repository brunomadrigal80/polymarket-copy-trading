import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { TradeStatus } from '../../odder-builder/copy-trading/entities/leader-trade.entity';
import { startOfWeek, subWeeks, format } from 'date-fns';
import { CopyTradingService } from '../../odder-builder/copy-trading/copy-trading.service';
import { FollowedWalletsService } from '../followed-wallets/followed-wallets.service';

export interface DashboardStats {
  walletsCount: number;
  activeWalletsCount: number;
  positionsCount: number;
  tradesCopied: number;
  tradesSkipped: number;
  tradesFailed: number;
  tradesPending: number;
  totalTrades: number;
  copyRatePercent: number;
  failRatePercent: number;
  lastCopyLatencyMs?: number | null;
  avgCopyLatencyMs?: number | null;
  lastFetchLatencyMs?: number | null;
  lastExecutionLatencyMs?: number | null;
  avgFetchLatencyMs?: number | null;
  avgExecutionLatencyMs?: number | null;
  tradesCopiedLast7Days: number;
}

export interface RecentTradeDto {
  id: string;
  tradeId: string;
  walletLabel: string | null;
  wallet: string;
  marketId: string;
  tokenId: string;
  slug?: string | null;
  side: string;
  size: string;
  executedSize?: string | null;
  price: string;
  status: TradeStatus;
  reason?: string | null;
  createdAt: string;
  latencyMs?: number | null;
  fetchLatencyMs?: number | null;
  executionLatencyMs?: number | null;
}

export interface WeeklyReportDto {
  weekStart: string;
  weekEnd: string;
  tradesCopied: number;
  tradesSkipped: number;
  tradesFailed: number;
  totalTrades: number;
  copyRatePercent: number;
  byWallet: { wallet: string; label?: string; copied: number; skipped: number; failed: number }[];
}

export interface LeaderComparisonDto {
  wallet: string;
  label?: string;
  copied: number;
  skipped: number;
  failed: number;
  totalSignals: number;
  copyRatePercent: number;
  failRatePercent: number;
}

export interface ComparativeAnalysisDto {
  bot: { totalCopied: number; totalSkipped: number; totalFailed: number; copyRatePercent: number };
  leaders: LeaderComparisonDto[];
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly copyTrading: CopyTradingService,
    private readonly wallets: FollowedWalletsService,
  ) {}

  async getStats(): Promise<DashboardStats> {
    const since7DaysAgo = subDays(new Date(), 7);
    const [allWallets, activeWallets, trades, positions, latencyStats] = await Promise.all([
      this.wallets.findAll(),
      this.wallets.findActive(),
      Promise.resolve(this.copyTrading.getLeaderTrades()),
      Promise.resolve(this.copyTrading.getBotPositions()),
      this.getCopyLatencyStats(),
    ]);

    const copied = trades.filter((t) => t.status === TradeStatus.COPIED).length;
    const copiedLast7Days = trades.filter(
      (t) => t.status === TradeStatus.COPIED && t.createdAt >= since7DaysAgo,
    ).length;
    const skipped = trades.filter((t) => t.status === TradeStatus.SKIPPED).length;
    const failed = trades.filter((t) => t.status === TradeStatus.FAILED).length;
    const pending = trades.filter((t) => t.status === TradeStatus.PENDING).length;
    const totalTrades = copied + skipped + failed + pending;
    const copyRatePercent = totalTrades > 0 ? (copied / totalTrades) * 100 : 0;
    const failRatePercent = totalTrades > 0 ? (failed / totalTrades) * 100 : 0;

    return {
      walletsCount: allWallets.length,
      activeWalletsCount: activeWallets.length,
      positionsCount: positions.length,
      tradesCopied: copied,
      tradesCopiedLast7Days: copiedLast7Days,
      tradesSkipped: skipped,
      tradesFailed: failed,
      tradesPending: pending,
      totalTrades,
      copyRatePercent: Math.round(copyRatePercent * 100) / 100,
      failRatePercent: Math.round(failRatePercent * 100) / 100,
      lastCopyLatencyMs: latencyStats?.lastCopyLatencyMs ?? null,
      avgCopyLatencyMs: latencyStats?.avgCopyLatencyMs ?? null,
      lastFetchLatencyMs: latencyStats?.lastFetchLatencyMs ?? null,
      lastExecutionLatencyMs: latencyStats?.lastExecutionLatencyMs ?? null,
      avgFetchLatencyMs: latencyStats?.avgFetchLatencyMs ?? null,
      avgExecutionLatencyMs: latencyStats?.avgExecutionLatencyMs ?? null,
    };
  }

  /** Avg exec uses only recent COPIED trades so the card matches the recent trades table. */
  private static readonly AVG_EXEC_RECENT_LIMIT = 50;

  private async getCopyLatencyStats(): Promise<{
    lastCopyLatencyMs: number | null;
    avgCopyLatencyMs: number | null;
    lastFetchLatencyMs: number | null;
    lastExecutionLatencyMs: number | null;
    avgFetchLatencyMs: number | null;
    avgExecutionLatencyMs: number | null;
  }> {
    const trades = this.copyTrading
      .getLeaderTrades()
      .filter((t) => t.status === TradeStatus.COPIED);
    const sortedByCopied = [...trades].sort(
      (a, b) => (b.copiedAt?.getTime() ?? 0) - (a.copiedAt?.getTime() ?? 0),
    );
    const lastTrade = sortedByCopied[0] ?? null;
    const withLatency = trades.filter((t) => t.latencyMs != null);
    const withFetch = trades.filter((t) => t.fetchLatencyMs != null);
    const withExecution = trades.filter((t) => t.executionLatencyMs != null);
    const recentWithExec = sortedByCopied
      .slice(0, DashboardService.AVG_EXEC_RECENT_LIMIT)
      .filter((t) => t.executionLatencyMs != null);

    if (withLatency.length === 0) {
      return {
        lastCopyLatencyMs: lastTrade?.latencyMs ?? null,
        avgCopyLatencyMs: null,
        lastFetchLatencyMs: lastTrade?.fetchLatencyMs ?? null,
        lastExecutionLatencyMs: lastTrade?.executionLatencyMs ?? null,
        avgFetchLatencyMs: null,
        avgExecutionLatencyMs:
          recentWithExec.length > 0
            ? Math.round(
                recentWithExec.reduce((s, t) => s + (t.executionLatencyMs ?? 0), 0) /
                  recentWithExec.length,
              )
            : null,
      };
    }
    return {
      lastCopyLatencyMs: lastTrade?.latencyMs ?? null,
      avgCopyLatencyMs: Math.round(
        withLatency.reduce((s, t) => s + (t.latencyMs ?? 0), 0) / withLatency.length,
      ),
      lastFetchLatencyMs: lastTrade?.fetchLatencyMs ?? null,
      lastExecutionLatencyMs: lastTrade?.executionLatencyMs ?? null,
      avgFetchLatencyMs:
        withFetch.length > 0
          ? Math.round(
              withFetch.reduce((s, t) => s + (t.fetchLatencyMs ?? 0), 0) / withFetch.length,
            )
          : null,
      avgExecutionLatencyMs:
        recentWithExec.length > 0
          ? Math.round(
              recentWithExec.reduce((s, t) => s + (t.executionLatencyMs ?? 0), 0) /
                recentWithExec.length,
            )
          : withExecution.length > 0
            ? Math.round(
                withExecution.reduce((s, t) => s + (t.executionLatencyMs ?? 0), 0) /
                  withExecution.length,
              )
            : null,
    };
  }

  async getRecentTrades(limit = 20, onlyCopied = false): Promise<RecentTradeDto[]> {
    const wallets = await this.wallets.findAll();
    const walletLabels = new Map(wallets.map((w) => [w.wallet, w.label]));

    let trades = this.copyTrading.getLeaderTrades();
    if (onlyCopied) trades = trades.filter((t) => t.status === TradeStatus.COPIED);
    trades = [...trades].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    trades = trades.slice(0, limit);

    return trades.map((t) => ({
      id: t.id,
      tradeId: t.tradeId,
      walletLabel: walletLabels.get(t.wallet) ?? null,
      wallet: t.wallet,
      marketId: t.marketId,
      tokenId: t.tokenId,
      slug: t.slug ?? undefined,
      side: t.side,
      size: t.size,
      executedSize: t.executedSize ?? undefined,
      price: t.price,
      status: t.status,
      reason: t.reason ?? undefined,
      createdAt: (t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt)).toISOString(),
      latencyMs: t.latencyMs ?? undefined,
      fetchLatencyMs: t.fetchLatencyMs ?? undefined,
      executionLatencyMs: t.executionLatencyMs ?? undefined,
    }));
  }

  async getWeeklyReports(weeks = 12): Promise<WeeklyReportDto[]> {
    const wallets = await this.wallets.findAll();
    const walletLabels = new Map(wallets.map((w) => [w.wallet, w.label]));
    const allTrades = this.copyTrading.getLeaderTrades();

    const reports: WeeklyReportDto[] = [];
    const now = new Date();

    for (let i = 0; i < weeks; i++) {
      const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const trades = allTrades.filter((t) => {
        const created = t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt);
        return created >= weekStart && created <= weekEnd;
      });

      const copied = trades.filter((t) => t.status === TradeStatus.COPIED).length;
      const skipped = trades.filter((t) => t.status === TradeStatus.SKIPPED).length;
      const failed = trades.filter((t) => t.status === TradeStatus.FAILED).length;
      const total = trades.length;
      const copyRatePercent = total > 0 ? (copied / total) * 100 : 0;

      const byWalletMap = new Map<string, { copied: number; skipped: number; failed: number }>();
      for (const t of trades) {
        if (!byWalletMap.has(t.wallet)) {
          byWalletMap.set(t.wallet, { copied: 0, skipped: 0, failed: 0 });
        }
        const row = byWalletMap.get(t.wallet)!;
        if (t.status === TradeStatus.COPIED) row.copied++;
        else if (t.status === TradeStatus.SKIPPED) row.skipped++;
        else if (t.status === TradeStatus.FAILED) row.failed++;
      }

      const byWallet = Array.from(byWalletMap.entries()).map(([wallet, counts]) => ({
        wallet,
        label: walletLabels.get(wallet),
        ...counts,
      }));

      reports.push({
        weekStart: format(weekStart, 'yyyy-MM-dd'),
        weekEnd: format(weekEnd, 'yyyy-MM-dd'),
        tradesCopied: copied,
        tradesSkipped: skipped,
        tradesFailed: failed,
        totalTrades: total,
        copyRatePercent: Math.round(copyRatePercent * 100) / 100,
        byWallet,
      });
    }

    return reports;
  }

  async getComparativeAnalysis(): Promise<ComparativeAnalysisDto> {
    const wallets = await this.wallets.findAll();
    const walletLabels = new Map(wallets.map((w) => [w.wallet, w.label]));
    const trades = this.copyTrading.getLeaderTrades();

    const bot = {
      totalCopied: trades.filter((t) => t.status === TradeStatus.COPIED).length,
      totalSkipped: trades.filter((t) => t.status === TradeStatus.SKIPPED).length,
      totalFailed: trades.filter((t) => t.status === TradeStatus.FAILED).length,
    };
    const total = bot.totalCopied + bot.totalSkipped + bot.totalFailed;
    const copyRatePercent = total > 0 ? (bot.totalCopied / total) * 100 : 0;

    const byWallet = new Map<string, { copied: number; skipped: number; failed: number }>();
    for (const t of trades) {
      if (!byWallet.has(t.wallet)) {
        byWallet.set(t.wallet, { copied: 0, skipped: 0, failed: 0 });
      }
      const row = byWallet.get(t.wallet)!;
      if (t.status === TradeStatus.COPIED) row.copied++;
      else if (t.status === TradeStatus.SKIPPED) row.skipped++;
      else if (t.status === TradeStatus.FAILED) row.failed++;
    }

    const leaders: LeaderComparisonDto[] = Array.from(byWallet.entries()).map(([wallet, counts]) => {
      const totalSignals = counts.copied + counts.skipped + counts.failed;
      return {
        wallet,
        label: walletLabels.get(wallet),
        copied: counts.copied,
        skipped: counts.skipped,
        failed: counts.failed,
        totalSignals,
        copyRatePercent: totalSignals > 0 ? Math.round((counts.copied / totalSignals) * 10000) / 100 : 0,
        failRatePercent: totalSignals > 0 ? Math.round((counts.failed / totalSignals) * 10000) / 100 : 0,
      };
    });

    return {
      bot: { ...bot, copyRatePercent: Math.round(copyRatePercent * 100) / 100 },
      leaders: leaders.sort((a, b) => b.totalSignals - a.totalSignals),
    };
  }

  /** Used by AlertsService to evaluate thresholds (no circular dep). */
  async getStatsForAlerts(): Promise<{ total: number; copied: number; failed: number; lastTradeAt: Date | null }> {
    const trades = this.copyTrading.getLeaderTrades();
    const total = trades.length;
    const copied = trades.filter((t) => t.status === TradeStatus.COPIED).length;
    const failed = trades.filter((t) => t.status === TradeStatus.FAILED).length;
    const dates = trades.map((t) => (t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt)).getTime());
    const lastTradeAt = dates.length ? new Date(Math.max(...dates)) : null;
    return { total, copied, failed, lastTradeAt };
  }
}
