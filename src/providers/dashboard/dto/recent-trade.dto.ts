import { ApiProperty } from '@nestjs/swagger';

export class RecentTradeDto {
  @ApiProperty({ description: 'Internal record ID' })
  id: string;

  @ApiProperty({ description: 'Polymarket trade ID' })
  tradeId: string;

  @ApiProperty({ description: 'Target (leader) username / label' })
  walletLabel: string | null;

  @ApiProperty({ description: 'Target proxy wallet address' })
  wallet: string;

  @ApiProperty({ description: 'Market ID' })
  marketId: string;

  @ApiProperty({ description: 'Token ID (outcome asset)' })
  tokenId: string;

  @ApiProperty({ description: 'Market/event slug', required: false })
  slug?: string | null;

  @ApiProperty({ description: 'Side', enum: ['BUY', 'SELL'] })
  side: string;

  @ApiProperty({ description: 'Leader trade size (decimal string)' })
  size: string;

  @ApiProperty({ description: 'Size we actually executed (for COPIED trades); use this for "my" size', required: false })
  executedSize?: string | null;

  @ApiProperty({ description: 'Price (decimal string)' })
  price: string;

  @ApiProperty({ description: 'Status', enum: ['PENDING', 'COPIED', 'SKIPPED', 'FAILED'] })
  status: string;

  @ApiProperty({ description: 'Skip/fail reason', required: false })
  reason?: string | null;

  @ApiProperty({ description: 'Created at (ISO 8601)' })
  createdAt: string;

  @ApiProperty({ description: 'Total latency in ms (leader trade → our execution); only for COPIED', required: false })
  latencyMs?: number | null;

  @ApiProperty({ description: 'Fetch latency: leader trade → we saw it (ms)', required: false })
  fetchLatencyMs?: number | null;

  @ApiProperty({ description: 'Execution latency: we saw it → order sent (ms)', required: false })
  executionLatencyMs?: number | null;
}
