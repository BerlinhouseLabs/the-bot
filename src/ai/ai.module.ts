import { Global, Module } from '@nestjs/common';

import { AiService } from './services/ai.service';
import { ToolsService } from './services/tools.service';
import { MemoryService } from './services/memory.service';
import { SupabaseConfig } from '../config/supabase.config';
import { OntologyService } from './services/ontology.service';

@Global()
@Module({
  providers: [
    AiService,
    ToolsService,
    MemoryService,
    SupabaseConfig,
    OntologyService,
  ],
  exports: [AiService],
})
export class AiModule {}
