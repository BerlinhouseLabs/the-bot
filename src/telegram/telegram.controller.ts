import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { Update } from 'grammy/types';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async onUpdate(@Body() update: Update): Promise<void> {
    await this.telegramService.handleUpdate(update);
  }
}
