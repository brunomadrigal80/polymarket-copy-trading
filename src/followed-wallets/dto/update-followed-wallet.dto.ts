import { ApiProperty } from '@nestjs/swagger';

export class UpdateFollowedWalletDto {
  @ApiProperty({ description: 'Optional label for the wallet', required: false })
  label?: string;

  @ApiProperty({ description: 'Whether the wallet is active for copy trading', required: false })
  isActive?: boolean;

  @ApiProperty({ description: 'Reset cursor (set to null for "first run" testing)', required: false, nullable: true })
  lastTradeId?: string | null;
}
