import { ZepClient } from '@getzep/zep-cloud';
import { ConfigService } from '@nestjs/config';
import type { Message } from '@getzep/zep-cloud/api';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { OntologyService } from './ontology.service';

const GROUP_ID = 'frontier_tower_sf';

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
    this.logger.log('Initializing Zep integration…');
    try {
      await this.zep.graph.setOntology(
        this.ontologyService.getCustomEntityTypes(),
        this.ontologyService.getCustomEdgeTypes(),
      );

      await this.ensureGroupGraph();

      this.logger.log('Zep initialization complete.');
    } catch (error) {
      this.logger.error('Zep initialization failed:', error);
    }
  }

  private async getSessionId(message: any) {
    const chatId = String(message.chat.id);
    const userId = String(message.from.id);

    if (message.message_thread_id) {
      return `${chatId}:${userId}:${message.message_thread_id}`;
    }

    if (message.reply_to_message?.message_thread_id) {
      return `${chatId}:${userId}:${message.reply_to_message.message_thread_id}`;
    }

    return `${chatId}:${userId}:general`;
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
        content,
        roleType: 'user',
      },
    ];

    await this.zep.memory.add(sessionId, {
      messages,
      ignoreRoles: ['assistant'],
    });

    await this.zep.graph.add({
      groupId: GROUP_ID,
      type: 'text',
      data: `${name}: ${content}`,
    });
  }

  async searchGraph(
    query: string,
    opts: { group?: boolean; userId?: string } = {},
  ) {
    const { group = false, userId } = opts;
    return await this.zep.graph.search({
      ...(group ? { groupId: GROUP_ID } : { userId }),
      query,
      scope: 'edges',
      limit: 5,
    });
  }

  private async ensureGroupGraph() {
    try {
      await this.zep.group.add({
        groupId: GROUP_ID,
        name: 'Frontier Tower Comms',
        description: 'Shared memory for all Telegram discussions',
      });
      this.logger.log(`Group graph ${GROUP_ID} created.`);
    } catch (error: any) {
      if (
        error?.status === 409 ||
        error?.response?.data?.code === 'ALREADY_EXISTS'
      ) {
        this.logger.debug(`Group graph ${GROUP_ID} already exists – skipping.`);
        return;
      }
      throw error;
    }
  }
}
