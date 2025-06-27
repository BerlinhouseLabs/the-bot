import { readFileSync } from 'fs';
import { StreamableFile } from '@nestjs/common';

import { AppService } from './app.service';

jest.mock('fs');

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('should return a StreamableFile', () => {
    (readFileSync as jest.Mock).mockReturnValue(Buffer.from('test'));
    const result = service.getFavicon();
    expect(result).toBeInstanceOf(StreamableFile);
  });
});
