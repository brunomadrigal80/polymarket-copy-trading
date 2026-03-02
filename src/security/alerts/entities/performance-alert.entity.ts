import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum AlertType {
  HIGH_FAIL_RATE = 'HIGH_FAIL_RATE',
  LOW_COPY_RATE = 'LOW_COPY_RATE',
  NO_RECENT_TRADES = 'NO_RECENT_TRADES',
  DEVIATION_FROM_LEADER = 'DEVIATION_FROM_LEADER',
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

@Entity('performance_alerts')
@Index(['createdAt'])
export class PerformanceAlert {
  @ApiProperty({ description: 'Alert UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: AlertType, description: 'Alert type' })
  @Column({ type: 'enum', enum: AlertType })
  type: AlertType;

  @ApiProperty({ enum: AlertSeverity, description: 'Severity' })
  @Column({ type: 'enum', enum: AlertSeverity, default: AlertSeverity.WARNING })
  severity: AlertSeverity;

  @ApiProperty({ description: 'Alert message' })
  @Column({ type: 'varchar', length: 500 })
  message: string;

  @ApiProperty({ description: 'Extra metadata', required: false })
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @ApiProperty({ description: 'Whether the alert has been read' })
  @Column({ default: false })
  read: boolean;

  @ApiProperty({ description: 'Created at (ISO 8601)' })
  @CreateDateColumn()
  createdAt: Date;
}
