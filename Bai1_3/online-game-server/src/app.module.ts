import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { CaroModule } from './caro/caro.module';
import { Line98Module } from './line98/line98.module';

@Module({
  imports: [AuthModule, UsersModule, CaroModule, Line98Module],
  controllers: [AppController],
})
export class AppModule {}