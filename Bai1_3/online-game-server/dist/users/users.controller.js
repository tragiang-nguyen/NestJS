"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(authService, usersService // Add this line
    ) {
        this.authService = authService;
        this.usersService = usersService;
    }
    getProfile(req) {
        var _a;
        const username = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.username;
        if (!username) {
            return { user: null, message: 'Bạn chưa đăng nhập!' };
        }
        const user = this.authService.getUser(username);
        return { user };
    }
    async updateProfile(req, body, res) {
        var _a;
        const oldUsername = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.username;
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
};
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.Render)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService // Add this line
    ])
], UsersController);
exports.UsersController = UsersController;
