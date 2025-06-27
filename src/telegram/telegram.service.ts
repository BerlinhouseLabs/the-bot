import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Bot } from 'grammy';
import { Update } from 'grammy/types';
import { ConfigService } from '@nestjs/config';
import { addReplyParam } from '@roziscoding/grammy-autoquote';

import { AiService } from '../ai/services/ai.service';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly bot: Bot;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly aiService: AiService,
    private readonly config: ConfigService,
  ) {
    this.bot = new Bot(this.config.get<string>('BOT_TOKEN'));
  }

  async onModuleInit() {
    this.bot.command('ask', async (ctx) => {
      if (!ctx.match) return;

      ctx.api.config.use(addReplyParam(ctx));
      await this.handleAskCommand(ctx);
    });

    this.bot.on('message', async (ctx) => {
      if (!ctx.message?.text) return;

      if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
        this.logger.log(`Received group message: ${ctx.message.text}`);
        await this.handleMessage(ctx);
      }
    });

    const base = this.config.get<string>('WEBHOOK_BASE_URL');

    if (!base) {
      throw new Error(
        'WEBHOOK_BASE_URL is not set. Run a tunnel (ngrok) and set it in your .env.',
      );
    }

    const route = '/api/v1/core/telegram/webhook';
    const webhookUrl = `${base.replace(/\/$/, '')}${route}`;

    await this.bot.init();

    const secretToken = this.config.get<string>('TELEGRAM_WEBHOOK_SECRET');

    await this.bot.api.setWebhook(webhookUrl, {
      secret_token: secretToken,
      allowed_updates: ['message'],
    });

    this.logger.log(`Telegram webhook registered ➜ ${webhookUrl}`);
  }

  async onModuleDestroy() {
    await this.bot.api.deleteWebhook({ drop_pending_updates: false });
  }

  async handleUpdate(update: Update) {
    await this.bot.handleUpdate(update);
  }

  private async handleAskCommand(ctx: any) {
    const answer = await this.aiService.getAnswer(ctx.match);
    await ctx.reply(answer as string);
  }

  private async handleMessage(ctx: any) {
    await this.aiService.processMessage(ctx.message);
  }
}
