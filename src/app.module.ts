import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DyanmicTestModule } from './dyanmic-test/dyanmic-test.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule.forRootAsync(ConfigModule, {
      useFactory: () => ({
        fileName: '.env',
        useProcess: false,
      }),
    }),
    DyanmicTestModule.forRootAsync(DyanmicTestModule, {
      useFactory: (config: ConfigService) => ({
        configString: config.getTestString(),
      }),
      imports: [ConfigModule.Deferred],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
