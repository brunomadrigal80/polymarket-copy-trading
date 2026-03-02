import { Module } from '@nestjs/common';
import { CopyTradingModule } from '../../odder-builder/copy-trading/copy-trading.module';
import { FollowedWalletsModule } from '../followed-wallets/followed-wallets.module';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [CopyTradingModule, FollowedWalletsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
