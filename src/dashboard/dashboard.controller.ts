import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DashboardService, DashboardStats, RecentTradeDto as RecentTradeServiceDto, WeeklyReportDto as WeeklyReportServiceDto, ComparativeAnalysisDto as ComparativeAnalysisServiceDto } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { RecentTradeDto } from './dto/recent-trade.dto';
import { WeeklyReportDto } from './dto/weekly-report.dto';
import { ComparativeAnalysisDto } from './dto/comparative-analysis.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Real-time dashboard stats' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics (followers, positions, trades by status, copy/fail rates)', type: DashboardStatsDto })
  async getStats(): Promise<DashboardStats> {
    return this.dashboard.getStats();
  }

  @Get('recent-trades')
  @ApiOperation({ summary: 'Recent trades (optionally only copied / my trades)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max number of trades (1–100, default 20)' })
  @ApiQuery({ name: 'onlyCopied', required: false, type: Boolean, description: 'If true, return only COPIED trades (my copy executions)' })
  @ApiResponse({ status: 200, description: 'List of recent trades', type: [RecentTradeDto] })
  async getRecentTrades(
    @Query('limit') limit?: string,
    @Query('onlyCopied') onlyCopied?: string,
  ): Promise<RecentTradeServiceDto[]> {
    const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit, 10) || 20)) : 20;
    const onlyCopiedBool = onlyCopied === 'true' || onlyCopied === '1';
    return this.dashboard.getRecentTrades(limitNum, onlyCopiedBool);
  }

  @Get('reports/weekly')
  @ApiOperation({ summary: 'Weekly performance reports' })
  @ApiQuery({ name: 'weeks', required: false, type: Number, description: 'Number of weeks to return (1–52, default 12)' })
  @ApiResponse({ status: 200, description: 'Weekly aggregated reports with per-wallet breakdown', type: [WeeklyReportDto] })
  async getWeeklyReports(
    @Query('weeks') weeks?: string,
  ): Promise<WeeklyReportServiceDto[]> {
    const weeksNum = weeks ? Math.min(52, Math.max(1, parseInt(weeks, 10) || 12)) : 12;
    return this.dashboard.getWeeklyReports(weeksNum);
  }

  @Get('analysis/compare')
  @ApiOperation({ summary: 'Comparative analysis: bot vs copied traders (leaders)' })
  @ApiResponse({ status: 200, description: 'Bot aggregate and per-leader copy/skip/fail stats', type: ComparativeAnalysisDto })
  async getComparativeAnalysis(): Promise<ComparativeAnalysisServiceDto> {
    return this.dashboard.getComparativeAnalysis();
  }
}
