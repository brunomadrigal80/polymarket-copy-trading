import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PolymarketClient } from '../clients/polymarket.client';
import { TradeActivityResponseDto } from './dto/trade-activity.dto';
import { ProxyWalletResponseDto } from './dto/proxy-wallet.dto';
import { PolymarketService } from './polymarket.service';

export interface TradeActivityDto {
  id: string;
  marketId: string;
  tokenID: string;
  side: 'BUY' | 'SELL';
  size: number;
  price: number;
  timestamp?: string;
}

@ApiTags('Polymarket')
@Controller('polymarket')
export class PolymarketController {
  constructor(
    private readonly polyClient: PolymarketClient,
    private readonly service: PolymarketService
  ) { }

  @Get('activity')
  @ApiOperation({ summary: 'Get trade activity for a wallet address' })
  @ApiQuery({ name: 'address', required: true, type: String, description: 'Wallet address (maker) to fetch trades for' })
  @ApiResponse({ status: 200, description: 'List of trades for the wallet', type: TradeActivityResponseDto })
  async getActivity(@Query('address') address: string): Promise<{ trades: TradeActivityDto[] }> {
    if (!address?.trim()) {
      return { trades: [] };
    }
    const client = await this.polyClient.getClient();
    const rawTrades = await client.getTrades({
      maker: address.trim(),
      limit: 50,
    });
    const trades: TradeActivityDto[] = (rawTrades ?? []).map((t: any) => ({
      id: t.id,
      marketId: t.market_id ?? t.marketId ?? '',
      tokenID: t.market_token_id ?? t.tokenID ?? '',
      side: t.side ?? 'BUY',
      size: Number(t.size ?? 0),
      price: Number(t.price ?? 0),
      timestamp: t.timestamp ?? t.created_at,
    }));
    return { trades };
  }

  @Get('proxy-wallet/:username')
  @ApiOperation({ summary: 'Get proxy wallet address for a Polymarket username' })
  @ApiParam({ name: 'username', description: 'Polymarket username (without @)', example: 'trader1' })
  @ApiResponse({ status: 200, description: 'Username and resolved proxy wallet address (or null)', type: ProxyWalletResponseDto })
  async getProxyWallet(@Param('username') username: string): Promise<ProxyWalletResponseDto> {
    return {
      username,
      proxyWallet: await this.service.getProxyWallet(username),
    };
  }
}
