import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { ConfigService } from '@nestjs/config';
import { AzureOpenAIEmbeddings } from '@langchain/openai';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';

import { SupabaseConfig } from '../../config/supabase.config';

@Injectable()
export class ToolsService implements OnModuleDestroy {
  private readonly client: MultiServerMCPClient;
  private readonly vectorStore: SupabaseVectorStore;
  private readonly embeddings: AzureOpenAIEmbeddings;
  private readonly logger = new Logger(ToolsService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly supabase: SupabaseConfig,
  ) {
    this.client = new MultiServerMCPClient({
      mcpServers: {
        notionApi: {
          command: 'npx',
          args: ['-y', '@notionhq/notion-mcp-server'],
          env: {
            OPENAPI_MCP_HEADERS: `{"Authorization": "Bearer ${this.config.get(
              'NOTION_API_KEY',
            )}", "Notion-Version": "2022-06-28" }`,
          },
        },
      },
    });
    this.embeddings = new AzureOpenAIEmbeddings({
      azureOpenAIApiVersion: '2024-12-01-preview',
      azureOpenAIApiEmbeddingsDeploymentName:
        this.config.get('EMBEDDING_MODEL'),
    });
    this.vectorStore = new SupabaseVectorStore(this.embeddings, {
      client: this.supabase,
      tableName: 'documents',
      queryName: 'match_documents',
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
      this.logger.log('MCP client closed successfully');
    }
  }

  async getAnswerTools() {
    const vectorSearch = tool(
      async ({ query }) => {
        const results = await this.vectorStore.similaritySearch(query, 5);
        return JSON.stringify(results, null, 2);
      },
      {
        name: 'vectorSearch',
        description: 'Performs a similarity search in the vector database.',
        schema: z.object({
          query: z.string().describe('The query to search for.'),
        }),
      },
    );
    const notionTools = await this.client.getTools();
    return [...notionTools, vectorSearch];
  }
}
