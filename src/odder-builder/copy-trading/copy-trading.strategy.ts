import { Injectable } from '@nestjs/common';

export interface NormalizedTrade {
  tradeId: string;
  marketId: string;
  tokenID: string;
  slug?: string;
  side: 'BUY' | 'SELL';
  size: number;
  price: number;
  /** Leader trade time (Unix seconds or ms from API); used for latency calculation */
  leaderTradeTimestamp?: number;
  /** When we received the trade (activity fetch completed) */
  fetchedAt?: Date;
}

export interface StrategyDecision {
  shouldTrade: boolean;
  side?: 'BUY' | 'SELL';
  size?: number;
  reason: string;
}

@Injectable()
export class CopyTradingStrategy {
  // ---- CONFIG ----
  private readonly MIN_EXECUTABLE_SIZE = 1; // Polymarket minimum
  private readonly MIN_SIGNAL_SIZE = 5;     // ignore micro rebalances
  private readonly MAX_POSITION_SIZE = 5;   // always copy with exactly 5 shares (don't buy more)

  decide(params: {
    leaderNetChange: number;
    botCurrentPosition: number;
    trade: NormalizedTrade;
  }): StrategyDecision {
    const { leaderNetChange, botCurrentPosition } = params;

    // Ignore noise
    if (Math.abs(leaderNetChange) < this.MIN_SIGNAL_SIZE) {
      return {
        shouldTrade: false,
        reason: 'Leader change too small (rebalance)',
      };
    }

    const side: 'BUY' | 'SELL' =
      leaderNetChange > 0 ? 'BUY' : 'SELL';

    // Already aligned
    if (
      (side === 'BUY' && botCurrentPosition > 0) ||
      (side === 'SELL' && botCurrentPosition < 0)
    ) {
      return {
        shouldTrade: false,
        reason: 'Bot already aligned',
      };
    }

    return {
      shouldTrade: true,
      side,
      size: this.MAX_POSITION_SIZE,
      reason: 'Leader showed meaningful intent',
    };
  }
}
