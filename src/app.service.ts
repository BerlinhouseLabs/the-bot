import { join } from 'path';
import { readFileSync } from 'fs';
import { Injectable, StreamableFile } from '@nestjs/common';

@Injectable()
export class AppService {
  getFavicon(): StreamableFile {
    const favicon = readFileSync(
      join(__dirname, '..', 'static', 'favicon.ico'),
    );
    return new StreamableFile(favicon);
  }
}
