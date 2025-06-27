import { ZepClient } from '@getzep/zep-cloud';
import { ConfigService } from '@nestjs/config';
import type { Message } from '@getzep/zep-cloud/api';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { OntologyService } from './ontology.service';

@Injectable()
export class MemoryService implements OnModuleInit {
  private readonly zep: ZepClient;
  private readonly logger = new Logger(MemoryService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly ontologyService: OntologyService,
  ) {
    this.zep = new ZepClient({
      apiKey: this.config.getOrThrow<string>('ZEP_API_KEY'),
    });
  }

  async onModuleInit() {
    this.logger.log('Setting custom graph ontology for Zep...');
    try {
      await this.zep.graph.setOntology(
        this.ontologyService.getCustomEntityTypes(),
        this.ontologyService.getCustomEdgeTypes(),
      );
      this.logger.log('Successfully set custom graph ontology.');
    } catch (error) {
      this.logger.error('Failed to set custom graph ontology:', error);
    }
  }

  private async getSessionId(message: any) {
    const chatId = String(message.chat.id);

    if (message.message_thread_id) {
      return `${chatId}:${message.message_thread_id}`;
    }

    if (message.reply_to_message?.message_thread_id) {
      return `${chatId}:${message.reply_to_message.message_thread_id}`;
    }

    return `${chatId}:general`;
  }

  async getUser(from: any) {
    try {
      return await this.zep.user.get(String(from.id));
    } catch {
      this.logger.log(`User ${from.id} not found. Creating new user.`);
      return await this.zep.user.add({
        userId: String(from.id),
        firstName: from.first_name || null,
        lastName: from.last_name || null,
        metadata: {
          handle: from.username,
          is_bot: from.is_bot,
        },
      });
    }
  }

  async getSession(userId: string, message: any) {
    const sessionId = await this.getSessionId(message);
    try {
      await this.zep.memory.get(sessionId);
      return sessionId;
    } catch {
      this.logger.log(`Session ${sessionId} not found. Creating new session.`);
      await this.zep.memory.addSession({
        sessionId,
        userId,
      });
      return sessionId;
    }
  }

  async addMessage(sessionId: string, name: string, content: string) {
    const messages: Message[] = [
      {
        role: name,
        content: content,
        roleType: 'user',
      },
    ];
    return await this.zep.memory.add(sessionId, {
      messages: messages,
      ignoreRoles: ['assistant'],
    });
  }
}
