import { ApiProperty } from '@nestjs/swagger';

class WeeklyReportByWalletDto {
  @ApiProperty() wallet: string;
  @ApiProperty({ required: false }) label?: string;
  @ApiProperty() copied: number;
  @ApiProperty() skipped: number;
  @ApiProperty() failed: number;
}

export class WeeklyReportDto {
  @ApiProperty({ description: 'Week start date (YYYY-MM-DD)', example: '2025-01-27' })
  weekStart: string;

  @ApiProperty({ description: 'Week end date (YYYY-MM-DD)', example: '2025-02-02' })
  weekEnd: string;

  @ApiProperty({ description: 'Trades copied in the week', example: 15 })
  tradesCopied: number;

  @ApiProperty({ description: 'Trades skipped in the week', example: 3 })
  tradesSkipped: number;

  @ApiProperty({ description: 'Trades failed in the week', example: 1 })
  tradesFailed: number;

  @ApiProperty({ description: 'Total trades in the week', example: 19 })
  totalTrades: number;

  @ApiProperty({ description: 'Copy rate percentage for the week', example: 78.95 })
  copyRatePercent: number;

  @ApiProperty({ type: [WeeklyReportByWalletDto], description: 'Breakdown by leader wallet' })
  byWallet: WeeklyReportByWalletDto[];
}
