import { Module, forwardRef } from '@nestjs/common';
import { PolymarketClient } from 'src/security/clients/polymarket.client';
import { PolymarketService } from './polymarket.service';
import { PolymarketPoller } from './polymarket.poller';
import { CopyTradingModule } from '../../odder-builder/copy-trading/copy-trading.module';
import { FollowedWalletsModule } from 'src/providers/followed-wallets/followed-wallets.module';

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
