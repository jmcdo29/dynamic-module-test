import { Module } from '@nestjs/common';
import { DyanmicTestService } from './dyanmic-test.service';
import { DyanmicTestController } from './dyanmic-test.controller';

@Module({
  providers: [DyanmicTestService],
  controllers: [DyanmicTestController],
})
export class DyanmicTestModule {}
