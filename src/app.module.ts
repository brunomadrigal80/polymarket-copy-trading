import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PolymarketClient } from './clients/polymarket.client';
import { PolymarketController } from './polymarket/polymarket.controller';
import { PolymarketService } from './polymarket/polymarket.service';
import { PolymarketPoller } from './polymarket/polymarket.poller';
import { CopyTradingModule } from './copy-trading/copy-trading.module';
import { FollowedWalletsModule } from './followed-wallets/followed-wallets.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    CopyTradingModule,
    FollowedWalletsModule,
    DashboardModule,
    AlertsModule,
  ],
  controllers: [PolymarketController],
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
export class AppModule { }
