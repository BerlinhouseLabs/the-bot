import { Controller, Get, StreamableFile } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/favicon.ico')
  getFavicon(): StreamableFile {
    return this.appService.getFavicon();
  }
}
