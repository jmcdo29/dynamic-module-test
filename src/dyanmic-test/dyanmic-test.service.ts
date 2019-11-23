import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class DyanmicTestService {
  constructor(
    @Inject('DYNAMIC_CONFIG_TOKEN')
    private readonly config: { configString: string },
  ) {}

  getConfigString(): string {
    return this.config.configString;
  }
}
