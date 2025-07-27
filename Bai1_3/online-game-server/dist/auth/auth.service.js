"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
let AuthService = class AuthService {
    constructor() {
        this.users = [];
    }
    async register(userData) {
        const { username, password, email, fullname, age, nickname } = userData;
        if (this.users.find(u => u.username === username)) {
            return { error: 'Username already exists' };
        }
        const user = { username, password, email, fullname, age, nickname };
        this.users.push(user);
        return { message: 'Register successful', username };
    }
    async validateUser(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (!user) {
            return { error: 'Invalid username or password' };
        }
        return { message: 'Login successful', username, user };
    }
    async login(userData) {
        const { username, password } = userData;
        const user = this.users.find(u => u.username === username && u.password === password);
        if (!user) {
            return { error: 'Invalid username or password' };
        }
        console.log('User logged in:', user);
        return { message: 'Login successful', username, user };
    }
    getUser(username) {
        return this.users.find(u => u.username === username);
    }
    updateUser(oldUsername, data) {
        const user = this.users.find(u => u.username === oldUsername);
        if (!user)
            return { error: 'User not found' };
        const oldPassword = user.password;
        const oldName = user.username;
        let messages = [];
        // Đổi username nếu có và không trùng với username khác
        if (typeof data.username === 'string' && data.username !== oldName) {
            if (this.users.find(u => u.username === data.username)) {
                return { error: 'Tên đăng nhập đã tồn tại' };
            }
            user.username = data.username; // ✅ đảm bảo data.username là string
        }
        else {
            messages.push('tên đăng nhập không thay đổi');
        }
        // Đổi password nếu có và khác cũ
        if (typeof data.password === 'string' && data.password !== oldPassword) {
            user.password = data.password; // ✅ đảm bảo data.password là string
        }
        else {
            messages.push('mật khẩu không thay đổi');
        }
        if (typeof data.email === 'string')
            user.email = data.email;
        if (typeof data.fullname === 'string')
            user.fullname = data.fullname;
        if (typeof data.age === 'number')
            user.age = data.age;
        if (typeof data.nickname === 'string')
            user.nickname = data.nickname;
        return {
            message: messages.join(', '),
            user,
            isUsernameChanged: data.username !== undefined && data.username !== oldName,
            isPasswordChanged: data.password !== undefined && data.password !== oldPassword,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
exports.AuthService = AuthService;
