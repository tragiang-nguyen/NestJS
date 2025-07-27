import { Controller, Get, Post, Put, Body, Query, Render, Req, Res, Param } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService // Add this line
  ) {}

  @Get('profile')
  @Render('profile')
  getProfile(@Req() req: Request) {
    const username = req.cookies?.username;
    if (!username) {
      return { user: null, message: 'Bạn chưa đăng nhập!' };
    }
    const user = this.authService.getUser(username);
    return { user };
  }

  @Post('profile')
  async updateProfile(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    const oldUsername = req.cookies?.username;
    if (!oldUsername) {
      return res.redirect('/auth/login');
    }

    const { username, password, email, fullname, age, nickname } = body;

    const result = this.authService.updateUser(oldUsername, {
      username,
      password,
      email,
      fullname,
      age: Number(age),
      nickname
    });

    if (result.error) {
      const user = this.authService.getUser(oldUsername);
      return res.render('profile', { user, message: result.error });
    }

    // Nếu username hoặc password thay đổi → bắt đăng nhập lại
    if (result.isUsernameChanged || result.isPasswordChanged) {
      res.clearCookie('username');
      return res.render('login', { message: 'Thông tin đăng nhập đã thay đổi, vui lòng đăng nhập lại.' });
    }

    // Cập nhật thành công nhưng không đổi tên hoặc mật khẩu
    res.cookie('username', username || oldUsername); // Cập nhật cookie nếu có đổi tên
    const user = this.authService.getUser(username || oldUsername);
    return res.render('profile', { user, message: result.message });
  }
}