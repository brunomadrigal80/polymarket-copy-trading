import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity()
@Unique(['marketId', 'tokenId'])
export class BotPosition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  marketId: string;

  @Column()
  tokenId: string;

  @Column('decimal', { precision: 36, scale: 18, default: 0 })
  netSize: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
