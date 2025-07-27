import { Injectable } from '@nestjs/common';

@Injectable()
export class CaroService {
  private board: (string | null)[][] = Array(15).fill(null).map(() => Array(15).fill(null));
  private currentPlayer: 'X' | 'O' = 'X';
  private gameActive: boolean = true;

  getInitialState() {
    return { board: this.board, status: `Player ${this.currentPlayer}'s turn` };
  }

  handleMove(row: number, col: number) {
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
    } else if (draw) {
      this.gameActive = false;
      status = "It's a draw!";
    } else {
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

  private checkWin(row: number, col: number): boolean {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (let [dx, dy] of directions) {
      let count = 1;
      for (let i = 1; i < 5; i++) {
        let newRow = row + i * dx;
        let newCol = col + i * dy;
        if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && this.board[newRow][newCol] === this.currentPlayer) {
          count++;
        } else break;
      }
      for (let i = 1; i < 5; i++) {
        let newRow = row - i * dx;
        let newCol = col - i * dy;
        if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && this.board[newRow][newCol] === this.currentPlayer) {
          count++;
        } else break;
      }
      if (count >= 5) return true;
    }
    return false;
  }

  private checkDraw(): boolean {
    return this.board.every(row => row.every(cell => cell !== null));
  }
}