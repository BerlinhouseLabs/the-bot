import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { AzureChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

import { ToolsService } from './tools.service';
import { MemoryService } from './memory.service';
import { QA_SYSTEM_PROMPT } from '../../common/prompts';
import { QA_RESPONSE_SCHEMA } from '../../common/schema';

@Injectable()
export class AiService {
  private readonly llm: AzureChatOpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly toolsService: ToolsService,
    private readonly memoryService: MemoryService,
  ) {
    this.llm = new AzureChatOpenAI({
      model: this.config.get('REASONING_MODEL'),
      azureOpenAIApiDeploymentName: this.config.get('REASONING_MODEL'),
      azureOpenAIApiVersion: '2024-12-01-preview',
    });
  }

  async getAnswer(question: string) {
    const tools = await this.toolsService.getAnswerTools();

    const agent = createReactAgent({
      llm: this.llm,
      tools,
      responseFormat: QA_RESPONSE_SCHEMA,
    });

    try {
      const response = await agent.invoke(
        {
          messages: [
            {
              role: 'system',
              content: QA_SYSTEM_PROMPT,
            },
            { role: 'user', content: question },
          ],
        },
        { recursionLimit: 50 },
      );

      return response.structuredResponse;
    } catch (error) {
      this.logger.error('Error during agent execution:', error);
      return {
        answer:
          'I encountered an error while trying to find an answer. Please try rephrasing your question.',
        source_type: null,
        source_document: null,
        confidence_score: 0,
        retrieval_score: null,
        tool_used: null,
      };
    }
  }

  async processMessage(message: any) {
    const user = await this.memoryService.getUser(message.from);
    const session = await this.memoryService.getSession(user.userId, message);

    return await this.memoryService.addMessage(
      session,
      user.firstName,
      message.text,
    );
  }
}
