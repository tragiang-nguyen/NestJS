import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users: any[] = [];

  updateProfile(id: string, data: any) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      Object.assign(user, data);
      return user;
    }
    return { error: 'User not found' };
  }
}