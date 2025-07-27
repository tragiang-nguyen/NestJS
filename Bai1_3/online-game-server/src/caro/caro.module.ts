import { Module } from '@nestjs/common';
import { CaroController } from './caro.controller';
import { CaroService } from './caro.service';

@Module({
  controllers: [CaroController],
  providers: [CaroService]
})
export class CaroModule {}