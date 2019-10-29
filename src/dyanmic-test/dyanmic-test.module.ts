import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DyanmicTestController } from './dyanmic-test.controller';
import { DyanmicTestService } from './dyanmic-test.service';

@Module({
  imports: [ConfigModule.externallyConfigured(ConfigModule, 1000)],
  providers: [DyanmicTestService],
  controllers: [DyanmicTestController],
})
export class DyanmicTestModule {}
