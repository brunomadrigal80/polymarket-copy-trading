import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PolymarketClient } from './security/clients/polymarket.client';
import { PolymarketController } from './security/polymarket/polymarket.controller';
import { PolymarketService } from './security/polymarket/polymarket.service';
import { PolymarketPoller } from './security/polymarket/polymarket.poller';
import { CopyTradingModule } from './odder-builder/copy-trading/copy-trading.module';
import { FollowedWalletsModule } from './providers/followed-wallets/followed-wallets.module';
import { DashboardModule } from './providers/dashboard/dashboard.module';
import { AlertsModule } from './security/alerts/alerts.module';

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
