import { Module } from '@nestjs/common';

import { AiModule } from '../ai/ai.module';
import { TelegramService } from './telegram.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, AiModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
