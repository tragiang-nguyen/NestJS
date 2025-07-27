import { Controller, Post, Body, Get, Render, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('login')
  getLogin() {
    return {};
  }

  @Get('register')
  @Render('register')
  getRegister() {
    return {};
  }

  @Post('register')
  async register(@Body() registerDto: any, @Res() res: Response) {
    const result = await this.authService.register(registerDto);
    if (result.error) {
      return res.render('register', { message: result.error });
    }
    return res.redirect('/auth/login');
  }

  @Post('login')
  async login(@Body() loginDto: any, @Res() res: Response) {
    const result = await this.authService.login(loginDto);
    if (result.error) {
      return res.render('login', { message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ' });
    }
    res.cookie('username', result.username);
    // Lấy user để truyền vào profile
    const user = this.authService.getUser(result.username);
    return res.render('profile', { user, message: 'Đăng nhập thành công!' });
  }
}