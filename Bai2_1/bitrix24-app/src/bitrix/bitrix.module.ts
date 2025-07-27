import { Module } from '@nestjs/common';
import { BitrixController } from './bitrix.controller';
import { BitrixService } from './bitrix.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [BitrixController],
  providers: [BitrixService],
})
export class BitrixModule {}