import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class FollowedWallet {
  @ApiProperty({ description: 'Follower UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Wallet address (0x...)' })
  @Column({ unique: true })
  wallet: string;

  @ApiProperty({ description: 'Optional label (e.g. @Leader1)', required: false })
  @Column({ nullable: true })
  label?: string;

  @ApiProperty({ description: 'Whether copy trading is active for this follower' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Last processed trade ID (cursor); null until first poll, then set by poller', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  lastTradeId?: string | null;

  @ApiProperty({ description: 'Created at (ISO 8601)' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at (ISO 8601)' })
  @UpdateDateColumn()
  updatedAt: Date;
}
