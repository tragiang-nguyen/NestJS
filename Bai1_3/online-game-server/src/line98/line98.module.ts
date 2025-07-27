import { Module } from '@nestjs/common';
import { Line98Controller } from './line98.controller';
import { Line98Service } from './line98.service';

@Module({
  controllers: [Line98Controller],
  providers: [Line98Service]
})
export class Line98Module {}