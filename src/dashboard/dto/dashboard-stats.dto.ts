import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({ description: 'Total number of followed wallets', example: 5 })
  walletsCount: number;

  @ApiProperty({ description: 'Number of active (enabled) followers', example: 4 })
  activeWalletsCount: number;

  @ApiProperty({ description: 'Number of bot positions', example: 12 })
  positionsCount: number;

  @ApiProperty({ description: 'Trades successfully copied (all time)', example: 42 })
  tradesCopied: number;

  @ApiProperty({ description: 'Trades copied in the last 7 days (closer to portfolio activity)', example: 8 })
  tradesCopiedLast7Days: number;

  @ApiProperty({ description: 'Trades skipped by strategy', example: 8 })
  tradesSkipped: number;

  @ApiProperty({ description: 'Trades that failed to execute', example: 2 })
  tradesFailed: number;

  @ApiProperty({ description: 'Trades pending execution', example: 0 })
  tradesPending: number;

  @ApiProperty({ description: 'Total leader trades processed', example: 52 })
  totalTrades: number;

  @ApiProperty({ description: 'Copy rate percentage (0–100)', example: 80.77 })
  copyRatePercent: number;

  @ApiProperty({ description: 'Fail rate percentage (0–100)', example: 3.85 })
  failRatePercent: number;

  @ApiProperty({ description: 'Total latency in ms of the last successfully copied trade', required: false })
  lastCopyLatencyMs?: number | null;

  @ApiProperty({ description: 'Average total copy latency in ms (copied trades only)', required: false })
  avgCopyLatencyMs?: number | null;

  @ApiProperty({ description: 'Last fetch latency (leader trade → we saw it) in ms', required: false })
  lastFetchLatencyMs?: number | null;

  @ApiProperty({ description: 'Last execution latency (we saw it → order sent) in ms', required: false })
  lastExecutionLatencyMs?: number | null;

  @ApiProperty({ description: 'Average fetch latency in ms', required: false })
  avgFetchLatencyMs?: number | null;

  @ApiProperty({ description: 'Average execution latency in ms', required: false })
  avgExecutionLatencyMs?: number | null;
}
