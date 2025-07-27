import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() { return {}; }

  @Get('login')
  @Render('login')
  login() { return {}; }

  @Get('register')
  @Render('register')
  register() { return {}; }

  @Get('profile')
  @Render('profile')
  profile() { return {}; }

  @Get('games/line98')
  @Render('line98')
  line98() { return {}; }

  @Get('games/caro')
  @Render('caro')
  caro() { return {}; }
}