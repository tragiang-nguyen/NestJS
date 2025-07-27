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
exports.CaroController = void 0;
const common_1 = require("@nestjs/common");
const caro_service_1 = require("./caro.service");
let CaroController = class CaroController {
    constructor(caroService) {
        this.caroService = caroService;
    }
    root() {
        return {};
    }
    init(res) {
        const { board, status } = this.caroService.getInitialState();
        res.json({ board, status });
    }
    move(body, res) {
        const { board, status, gameActive, message } = this.caroService.handleMove(body.row, body.col);
        res.json({ board, status, gameActive, message });
    }
    restart(res) {
        const { board, status } = this.caroService.handleRestart();
        res.json({ board, status });
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('caro'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CaroController.prototype, "root", null);
__decorate([
    (0, common_1.Get)('init'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CaroController.prototype, "init", null);
__decorate([
    (0, common_1.Post)('move'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CaroController.prototype, "move", null);
__decorate([
    (0, common_1.Post)('restart'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CaroController.prototype, "restart", null);
CaroController = __decorate([
    (0, common_1.Controller)('caro'),
    __metadata("design:paramtypes", [caro_service_1.CaroService])
], CaroController);
exports.CaroController = CaroController;
