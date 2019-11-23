import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { Module } from '@nestjs/common';
import { CONFIG_MODULE_OPTIONS } from './config.constants';
import { ConfigService } from './config.service';
import { ConfigModuleOptions } from './interfaces/config-options.interface';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule extends createConfigurableDynamicRootModule<
  ConfigModule,
  ConfigModuleOptions
>(CONFIG_MODULE_OPTIONS) {}
