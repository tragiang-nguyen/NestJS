import { Injectable } from '@nestjs/common';

interface User {
    username: string;
    password: string;
    email?: string;
    fullname?: string;
    age?: number;
    nickname?: string;
}

@Injectable()
export class AuthService {
    private users: User[] = [];

    async register(userData: any): Promise<any> {
        const { username, password, email, fullname, age, nickname } = userData;
        if (this.users.find(u => u.username === username)) {
            return { error: 'Username already exists' };
        }
        const user: User = { username, password, email, fullname, age, nickname };
        this.users.push(user);
        return { message: 'Register successful', username };
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (!user) {
            return { error: 'Invalid username or password' };
        }
        return { message: 'Login successful', username, user };
    }

    async login(userData: any): Promise<any> {
        const { username, password } = userData;
        const user = this.users.find(u => u.username === username && u.password === password);
        if (!user) {
            return { error: 'Invalid username or password' };
        }
        console.log('User logged in:', user);
        return { message: 'Login successful', username, user };
    }

    getUser(username: string): User | undefined {
        return this.users.find(u => u.username === username);
    }

    updateUser(oldUsername: string, data: Partial<User>): any {
        const user = this.users.find(u => u.username === oldUsername);
        if (!user) return { error: 'User not found' };

        const oldPassword = user.password;
        const oldName = user.username;

        let messages: string[] = [];

        // Đổi username nếu có và không trùng với username khác
        if (typeof data.username === 'string' && data.username !== oldName) {
            if (this.users.find(u => u.username === data.username)) {
            return { error: 'Tên đăng nhập đã tồn tại' };
            }
            user.username = data.username;  // ✅ đảm bảo data.username là string
        } else {
            messages.push('tên đăng nhập không thay đổi');
        }

        // Đổi password nếu có và khác cũ
        if (typeof data.password === 'string' && data.password !== oldPassword) {
            user.password = data.password;  // ✅ đảm bảo data.password là string
        } else {
            messages.push('mật khẩu không thay đổi');
        }

        if (typeof data.email === 'string') user.email = data.email;
        if (typeof data.fullname === 'string') user.fullname = data.fullname;
        if (typeof data.age === 'number') user.age = data.age;
        if (typeof data.nickname === 'string') user.nickname = data.nickname;

        return {
            message: messages.join(', '),
            user,
            isUsernameChanged: data.username !== undefined && data.username !== oldName,
            isPasswordChanged: data.password !== undefined && data.password !== oldPassword,
        };
    }
}