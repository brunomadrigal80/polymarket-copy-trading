import { ApiProperty } from '@nestjs/swagger';

class BotSummaryDto {
  @ApiProperty() totalCopied: number;
  @ApiProperty() totalSkipped: number;
  @ApiProperty() totalFailed: number;
  @ApiProperty({ description: 'Overall copy rate %' }) copyRatePercent: number;
}

class LeaderComparisonDto {
  @ApiProperty() wallet: string;
  @ApiProperty({ required: false }) label?: string;
  @ApiProperty() copied: number;
  @ApiProperty() skipped: number;
  @ApiProperty() failed: number;
  @ApiProperty({ description: 'Total signals from this leader' }) totalSignals: number;
  @ApiProperty({ description: 'Copy rate % for this leader' }) copyRatePercent: number;
  @ApiProperty({ description: 'Fail rate % for this leader' }) failRatePercent: number;
}

export class ComparativeAnalysisDto {
  @ApiProperty({ type: BotSummaryDto, description: 'Bot aggregate stats' })
  bot: BotSummaryDto;

  @ApiProperty({ type: [LeaderComparisonDto], description: 'Per-leader comparison' })
  leaders: LeaderComparisonDto[];
}
