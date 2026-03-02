import { ApiProperty } from '@nestjs/swagger';

export class TradeActivityItemDto {
  @ApiProperty({ description: 'Trade ID' })
  id: string;

  @ApiProperty({ description: 'Market ID' })
  marketId: string;

  @ApiProperty({ description: 'Market token ID' })
  tokenID: string;

  @ApiProperty({ description: 'Side', enum: ['BUY', 'SELL'] })
  side: 'BUY' | 'SELL';

  @ApiProperty({ description: 'Size' })
  size: number;

  @ApiProperty({ description: 'Price' })
  price: number;

  @ApiProperty({ description: 'Trade timestamp (ISO)', required: false })
  timestamp?: string;
}

export class TradeActivityResponseDto {
  @ApiProperty({ type: [TradeActivityItemDto], description: 'Trades for the given wallet address' })
  trades: TradeActivityItemDto[];
}
