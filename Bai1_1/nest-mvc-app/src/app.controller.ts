import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('home')
  getHome() {
    return { title: 'Trang chủ', message: 'Chào mừng đến với NestJS View!' };
    // return this.appService.getHello();
  }
}
