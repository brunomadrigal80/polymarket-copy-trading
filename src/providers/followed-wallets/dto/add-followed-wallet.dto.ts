import { ApiProperty } from '@nestjs/swagger';

export class AddFollowedWalletDto {
  @ApiProperty({ description: 'Wallet address to follow', example: '0xabc123...' })
  wallet: string;

  @ApiProperty({ description: 'Optional label for the wallet', required: false, example: 'Leader Wallet' })
  label?: string;
}