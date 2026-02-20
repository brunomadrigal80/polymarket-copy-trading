import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    CreateDateColumn,
  } from 'typeorm';
  
  export enum TradeStatus {
    PENDING = 'PENDING',
    COPIED = 'COPIED',
    SKIPPED = 'SKIPPED',
    FAILED = 'FAILED',
  }
  
  @Entity('leader_trades')
  @Index(['tradeId'], { unique: true })
  export class LeaderTrade {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    tradeId: string; // Polymarket trade id
  
    @Column()
    wallet: string; // leader wallet
  
    @Column()
    marketId: string;
  
  @Column()
  tokenId: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  slug?: string | null;

  @Column()
  side: 'BUY' | 'SELL';
  
    @Column({ type: 'decimal', precision: 36, scale: 18 })
    size: string;
  
    @Column({ type: 'decimal', precision: 36, scale: 18 })
    price: string;
  
    @Column({
      type: 'enum',
      enum: TradeStatus,
      default: TradeStatus.PENDING,
    })
    status: TradeStatus;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    reason?: string | null;

  /** When the leader trade occurred (from Polymarket API timestamp) */
  @Column({ type: 'datetime', nullable: true })
  leaderTradeAt?: Date | null;

  /** When we received the trade (activity fetch completed) */
  @Column({ type: 'datetime', nullable: true })
  fetchedAt?: Date | null;

  /** When we finished executing the copy trade */
  @Column({ type: 'datetime', nullable: true })
  copiedAt?: Date | null;

  /** Total latency: leader trade → our execution (only for COPIED) */
  @Column({ type: 'int', nullable: true })
  latencyMs?: number | null;

  /** Fetch latency: leader trade → we saw it (ms) */
  @Column({ type: 'int', nullable: true })
  fetchLatencyMs?: number | null;

  /** Execution latency: we saw it → order sent (ms) */
  @Column({ type: 'int', nullable: true })
  executionLatencyMs?: number | null;

  /** Size we actually executed (only for COPIED); may differ from leader size due to strategy caps */
  @Column({ type: 'decimal', precision: 36, scale: 18, nullable: true })
  executedSize?: string | null;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  