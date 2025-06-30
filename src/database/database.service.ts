import { Injectable, Logger } from '@nestjs/common';

import { SupabaseConfig } from '../config/supabase.config';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly supabase: SupabaseConfig) {}

  async saveQuestion(questionObj: {
    question: any;
    response: any;
  }): Promise<void> {
    const { error } = await this.supabase.from('questions').insert({
      question: questionObj.question,
      response: questionObj.response,
    });
    if (error) {
      this.logger.error(`Error saving object: ${error.message}`);
    }
  }
}
