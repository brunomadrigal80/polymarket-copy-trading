import { Module } from '@nestjs/common';
import { FollowedWalletsService } from './followed-wallets.service';
import { FollowedWalletsController } from './followed-wallets.controller';

@Module({
  imports: [],
  providers: [FollowedWalletsService],
  controllers: [FollowedWalletsController],
  exports: [FollowedWalletsService],
})
export class FollowedWalletsModule {}
