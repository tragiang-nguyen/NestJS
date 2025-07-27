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
exports.Line98Controller = void 0;
const common_1 = require("@nestjs/common");
const line98_service_1 = require("./line98.service");
let Line98Controller = class Line98Controller {
    constructor(line98Service) {
        this.line98Service = line98Service;
    }
    root() {
        return {};
    }
    init(res) {
        const state = this.line98Service.getInitialState();
        res.json(state);
    }
    move(body, res) {
        const state = this.line98Service.handleMove(body.row, body.col);
        res.json(state);
    }
    restart(res) {
        const state = this.line98Service.handleRestart();
        res.json(state);
    }
    help(res) {
        const state = this.line98Service.getHelpMove();
        res.json(state);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('line98'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Line98Controller.prototype, "root", null);
__decorate([
    (0, common_1.Get)('init'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Line98Controller.prototype, "init", null);
__decorate([
    (0, common_1.Post)('move'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Line98Controller.prototype, "move", null);
__decorate([
    (0, common_1.Post)('restart'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Line98Controller.prototype, "restart", null);
__decorate([
    (0, common_1.Post)('help'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Line98Controller.prototype, "help", null);
Line98Controller = __decorate([
    (0, common_1.Controller)('line98'),
    __metadata("design:paramtypes", [line98_service_1.Line98Service])
], Line98Controller);
exports.Line98Controller = Line98Controller;
