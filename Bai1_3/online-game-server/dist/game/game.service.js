"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
let GameService = class GameService {
    constructor() {
        this.games = [];
    }
    // Method to start a new game
    startGame(gameType) {
        // Initialize the game board
        const board = Array.from({ length: 9 }, () => Array(9).fill(0));
        const newGame = { id: this.games.length + 1, type: gameType, board };
        this.games.push(newGame);
        return newGame;
    }
    // Method to get the current state of a game
    getGameState(gameId) {
        return this.games.find(game => game.id === gameId);
    }
    // Method to handle player actions in a game
    handlePlayerAction(gameId, playerId, action) {
        const game = this.getGameState(gameId);
        if (!game)
            return { error: 'Game not found' };
        // Process action: move, suggest, restart...
        // Update game.board and return the new state
        // ...
        return { board: game.board, id: game.id, type: game.type };
    }
};
GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
exports.GameService = GameService;
