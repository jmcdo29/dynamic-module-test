import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DyanmicTestController } from './dyanmic-test.controller';
import { DyanmicTestService } from './dyanmic-test.service';
import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';

@Module({
  providers: [DyanmicTestService],
  controllers: [DyanmicTestController],
})
export class DyanmicTestModule extends createConfigurableDynamicRootModule<
  DyanmicTestModule,
  {
    configString: string;
  }
>('DYNAMIC_CONFIG_TOKEN') {}
