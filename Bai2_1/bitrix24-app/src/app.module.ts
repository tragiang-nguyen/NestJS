import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BitrixModule } from './bitrix/bitrix.module';

@Module({
  imports: [ConfigModule.forRoot(), BitrixModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}