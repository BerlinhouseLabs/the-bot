import { Module } from '@nestjs/common';

import { DatabaseService } from './database.service';
import { SupabaseConfig } from '../config/supabase.config';

@Module({
  providers: [DatabaseService, SupabaseConfig],
  exports: [DatabaseService],
})
export class DatabaseModule {}
