import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { AzureChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

import { ToolsService } from './tools.service';
import { MemoryService } from './memory.service';

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
      model: 'o4-mini',
      azureOpenAIApiDeploymentName: 'o4-mini',
      azureOpenAIApiVersion: '2024-12-01-preview',
    });
  }

  async getAnswer(question: string) {
    const tools = await this.toolsService.getAnswerTools();

    const agent = createReactAgent({
      llm: this.llm,
      tools,
    });

    try {
      const response = await agent.invoke({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful AI assistant that always references Notion for data and information.',
          },
          { role: 'user', content: question },
        ],
      });
      return response.messages[response.messages?.length - 1].content;
    } catch (error) {
      this.logger.error('Error during agent execution:', error);
      if (error.name === 'ToolException') {
        this.logger.error('Tool execution failed:', error.message);
      }
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
