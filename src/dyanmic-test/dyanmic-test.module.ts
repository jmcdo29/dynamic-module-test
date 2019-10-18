import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DyanmicTestService } from './dyanmic-test.service';
import { DyanmicTestController } from './dyanmic-test.controller';

@Module({
  imports: [ConfigModule],
  providers: [DyanmicTestService],
  controllers: [DyanmicTestController],
})
export class DyanmicTestModule {}
