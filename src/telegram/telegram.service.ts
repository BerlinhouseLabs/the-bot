import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Bot } from 'grammy';
import { ConfigService } from '@nestjs/config';
import { addReplyParam } from '@roziscoding/grammy-autoquote';

import { AiService } from '../ai/services/ai.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly bot: Bot;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly aiService: AiService,
    private readonly config: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    this.bot = new Bot(this.config.get<string>('BOT_TOKEN'));
  }

  async onModuleInit() {
    this.bot.command('ask', async (ctx) => {
      if (!ctx.match) return;
      this.logger.log(`Received ask command: ${ctx.match}`);
      ctx.api.config.use(addReplyParam(ctx));
      await this.handleAskCommand(ctx);
    });

    this.bot.on('message', async (ctx) => {
      if (!ctx.message?.text || ctx.message.text.trim() === '') return;
      if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
        this.logger.log(`Received message: ${ctx.message.text}`);
        await this.handleMessage(ctx);
      }
    });

    await this.bot.start({
      onStart: () => {
        this.logger.log('Telegram bot started polling for updates');
      },
    });
  }

  async onModuleDestroy() {
    await this.bot.stop();
    this.logger.log('Telegram bot stopped');
  }

  private async handleAskCommand(ctx: any) {
    const structuredResponse = await this.aiService.getAnswer(ctx.match);
    await ctx.reply(structuredResponse.answer);

    await this.aiService.processMessage(ctx.message);
    await this.databaseService.saveQuestion({
      question: ctx,
      response: structuredResponse,
    });
  }

  private async handleMessage(ctx: any) {
    await this.aiService.processMessage(ctx.message);
  }
}
