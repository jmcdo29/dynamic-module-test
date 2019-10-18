import { Controller, Get } from '@nestjs/common';
import { DyanmicTestService } from './dyanmic-test.service';

@Controller('dyanmic-test')
export class DyanmicTestController {
  constructor(private readonly service: DyanmicTestService) {}

  @Get()
  getString(): string {
    return this.service.getConfigString();
  }
}
