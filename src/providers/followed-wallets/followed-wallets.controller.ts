import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FollowedWalletsService } from './followed-wallets.service';
import { FollowedWallet } from './entity/followed-wallet.entity';
import { AddFollowedWalletDto } from './dto/add-followed-wallet.dto';
import { UpdateFollowedWalletDto } from './dto/update-followed-wallet.dto';

@ApiTags('Followers (Followed Wallets)')
@Controller('wallets')
export class FollowedWalletsController {
  constructor(private readonly service: FollowedWalletsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all followed wallets (followers)' })
  @ApiResponse({ status: 200, description: 'List of all followers', type: [FollowedWallet] })
  async findAll(): Promise<FollowedWallet[]> {
    return this.service.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get only active followed wallets' })
  @ApiResponse({ status: 200, description: 'List of active followers (used for copy trading)', type: [FollowedWallet] })
  async findActive(): Promise<FollowedWallet[]> {
    return this.service.findActive();
  }

  @Post()
  @ApiOperation({ summary: 'Add a new follower (wallet to copy)' })
  @ApiBody({ type: AddFollowedWalletDto })
  @ApiResponse({ status: 201, description: 'Follower added', type: FollowedWallet })
  async add(@Body() body: AddFollowedWalletDto): Promise<FollowedWallet> {
    const { wallet, label } = body;
    return this.service.add(wallet, label);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a follower (e.g. set active/inactive)' })
  @ApiParam({ name: 'id', description: 'Follower UUID' })
  @ApiBody({ type: UpdateFollowedWalletDto })
  @ApiResponse({ status: 200, description: 'Follower updated', type: FollowedWallet })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateFollowedWalletDto,
  ): Promise<FollowedWallet> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a follower by ID' })
  @ApiParam({ name: 'id', description: 'Follower UUID' })
  @ApiResponse({ status: 200, description: 'Follower removed' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Delete('by-wallet/:wallet')
  @ApiOperation({ summary: 'Remove a follower by wallet address' })
  @ApiParam({ name: 'wallet', description: 'Wallet address (0x...)' })
  @ApiResponse({ status: 200, description: 'Follower removed' })
  async removeByWallet(@Param('wallet') wallet: string) {
    return this.service.removeByWallet(wallet);
  }
}
