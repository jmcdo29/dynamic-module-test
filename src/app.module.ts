import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DyanmicTestModule } from './dyanmic-test/dyanmic-test.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule.forRootAsync({
      useFactory: () => ({
        fileName: '.env',
        useProcess: false,
      }),
    }),
    DyanmicTestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
