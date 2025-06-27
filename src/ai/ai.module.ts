import { Module } from '@nestjs/common';

import { AiService } from './services/ai.service';
import { ToolsService } from './services/tools.service';
import { MemoryService } from './services/memory.service';
import { OntologyService } from './services/ontology.service';

@Module({
  providers: [AiService, MemoryService, ToolsService, OntologyService],
  exports: [AiService],
})
export class AiModule {}
