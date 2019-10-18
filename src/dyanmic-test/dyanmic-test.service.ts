import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DyanmicTestService {

  constructor(private readonly config: ConfigService) {}

  getConfigString(): string {
    return this.config.getTestString();
    // return 'test string';
  }
}
