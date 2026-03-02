import { ApiProperty } from '@nestjs/swagger';

export class ProxyWalletResponseDto {
  @ApiProperty({ description: 'Polymarket username (without @)', example: 'trader1' })
  username: string;

  @ApiProperty({
    description: 'Proxy wallet address for the user, or null if not found',
    example: '0x1234...',
    nullable: true,
  })
  proxyWallet: string | null;
}
