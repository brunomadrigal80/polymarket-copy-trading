import { Module, forwardRef } from '@nestjs/common';
import { PolymarketClient } from 'src/clients/polymarket.client';
import { PolymarketService } from './polymarket.service';
import { PolymarketPoller } from './polymarket.poller';
import { CopyTradingModule } from '../copy-trading/copy-trading.module';
import { FollowedWalletsModule } from 'src/followed-wallets/followed-wallets.module';

@Module({
  imports: [
    forwardRef(() => CopyTradingModule),
    FollowedWalletsModule
  ],
  providers: [
    PolymarketClient,
    PolymarketService,
    PolymarketPoller,
  ],
  exports: [
    PolymarketClient,
    PolymarketService,
  ],
})
export class PolymarketModule {}
