"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaroService = void 0;
const common_1 = require("@nestjs/common");
let CaroService = class CaroService {
    constructor() {
        this.board = Array(15).fill(null).map(() => Array(15).fill(null));
        this.currentPlayer = 'X';
        this.gameActive = true;
    }
    getInitialState() {
        return { board: this.board, status: `Player ${this.currentPlayer}'s turn` };
    }
    handleMove(row, col) {
        if (!this.gameActive || this.board[row][col]) {
            return { board: this.board, status: `Player ${this.currentPlayer}'s turn`, gameActive: this.gameActive, message: '' };
        }
        this.board[row][col] = this.currentPlayer;
        const win = this.checkWin(row, col);
        const draw = this.checkDraw();
        let status = `Player ${this.currentPlayer}'s turn`;
        let message = '';
        if (win) {
            this.gameActive = false;
            status = `Player ${this.currentPlayer} wins!`;
        }
        else if (draw) {
            this.gameActive = false;
            status = "It's a draw!";
        }
        else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            status = `Player ${this.currentPlayer}'s turn`;
        }
        return { board: this.board, status, gameActive: this.gameActive, message };
    }
    handleRestart() {
        this.board = Array(15).fill(null).map(() => Array(15).fill(null));
        this.currentPlayer = 'X';
        this.gameActive = true;
        return { board: this.board, status: `Player ${this.currentPlayer}'s turn` };
    }
    checkWin(row, col) {
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        for (let [dx, dy] of directions) {
            let count = 1;
            for (let i = 1; i < 5; i++) {
                let newRow = row + i * dx;
                let newCol = col + i * dy;
                if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && this.board[newRow][newCol] === this.currentPlayer) {
                    count++;
                }
                else
                    break;
            }
            for (let i = 1; i < 5; i++) {
                let newRow = row - i * dx;
                let newCol = col - i * dy;
                if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && this.board[newRow][newCol] === this.currentPlayer) {
                    count++;
                }
                else
                    break;
            }
            if (count >= 5)
                return true;
        }
        return false;
    }
    checkDraw() {
        return this.board.every(row => row.every(cell => cell !== null));
    }
};
CaroService = __decorate([
    (0, common_1.Injectable)()
], CaroService);
exports.CaroService = CaroService;
