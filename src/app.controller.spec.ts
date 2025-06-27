import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getFavicon', () => {
    it('should return a StreamableFile', () => {
      const result = appController.getFavicon();
      expect(result).toBeDefined();
      expect(result.constructor.name).toBe('StreamableFile');
    });
  });
});
