import { Module, forwardRef } from '@nestjs/common';
import { CopyTradingService } from './copy-trading.service';
import { PolymarketModule } from 'src/polymarket/polymarket.module';
import { CopyTradingStrategy } from './copy-trading.strategy';
import { PolymarketClient } from 'src/clients/polymarket.client';

@Module({
  imports: [forwardRef(() => PolymarketModule)],
  providers: [CopyTradingService, CopyTradingStrategy, PolymarketClient],
  exports: [CopyTradingService],
})
export class CopyTradingModule {}