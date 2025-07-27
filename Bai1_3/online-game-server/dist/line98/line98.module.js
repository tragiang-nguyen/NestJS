"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line98Module = void 0;
const common_1 = require("@nestjs/common");
const line98_controller_1 = require("./line98.controller");
const line98_service_1 = require("./line98.service");
let Line98Module = class Line98Module {
};
Line98Module = __decorate([
    (0, common_1.Module)({
        controllers: [line98_controller_1.Line98Controller],
        providers: [line98_service_1.Line98Service]
    })
], Line98Module);
exports.Line98Module = Line98Module;
