"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
let PlayerService = class PlayerService {
    constructor() {
        this.players = [];
    }
    getPlayerById(id) {
        return this.players.find(p => p.id === id) || { error: 'Player not found' };
    }
    createPlayer(createPlayerDto) {
        const newPlayer = Object.assign({ id: (this.players.length + 1).toString() }, createPlayerDto);
        this.players.push(newPlayer);
        return newPlayer;
    }
    updatePlayer(id, updatePlayerDto) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            Object.assign(player, updatePlayerDto);
            return player;
        }
        return { error: 'Player not found' };
    }
};
PlayerService = __decorate([
    (0, common_1.Injectable)()
], PlayerService);
exports.PlayerService = PlayerService;
