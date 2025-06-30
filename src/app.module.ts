import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AiModule } from './ai/ai.module';
import { HealthModule } from './health/health.module';
import { SupabaseConfig } from './config/supabase.config';
import { DatabaseModule } from './database/database.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AiModule,
    HealthModule,
    DatabaseModule,
    TelegramModule,
  ],
  providers: [SupabaseConfig],
})
export class AppModule {}
