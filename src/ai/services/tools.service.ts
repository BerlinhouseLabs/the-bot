import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';

@Injectable()
export class ToolsService {
  private readonly logger = new Logger(ToolsService.name);

  constructor(private readonly config: ConfigService) {}

  async getAnswerTools() {
    const client = new MultiServerMCPClient({
      throwOnLoadError: true,
      prefixToolNameWithServerName: true,
      additionalToolNamePrefix: 'mcp',
      useStandardContentBlocks: true,
      mcpServers: {
        notionApi: {
          command: 'npx',
          args: ['-y', '@notionhq/notion-mcp-server'],
          env: {
            OPENAPI_MCP_HEADERS: `{"Authorization": "Bearer ${this.config.get('NOTION_API_KEY')}", "Notion-Version": "2022-06-28" }`,
          },
          restart: {
            enabled: true,
            maxAttempts: 3,
            delayMs: 1000,
          },
        },
      },
    });
    return await client.getTools();
  }
}
