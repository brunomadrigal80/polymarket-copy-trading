import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { PerformanceAlert } from './entities/performance-alert.entity';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alerts: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'List performance alerts' })
  @ApiQuery({ name: 'unreadOnly', required: false, type: String, description: 'If "true" or "1", return only unread alerts' })
  @ApiResponse({ status: 200, description: 'List of performance alerts (newest first)', type: [PerformanceAlert] })
  async list(
    @Query('unreadOnly') unreadOnly?: string,
  ): Promise<PerformanceAlert[]> {
    const unread = unreadOnly === 'true' || unreadOnly === '1';
    return this.alerts.findAll(unread);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all alerts as read' })
  @ApiResponse({ status: 200, description: 'Number of alerts marked as read' })
  async markAllAsRead(): Promise<{ count: number }> {
    return this.alerts.markAllAsRead();
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a single alert as read' })
  @ApiParam({ name: 'id', description: 'Alert UUID' })
  @ApiResponse({ status: 200, description: 'Updated alert', type: PerformanceAlert })
  async markAsRead(@Param('id') id: string): Promise<PerformanceAlert> {
    return this.alerts.markAsRead(id);
  }
}
