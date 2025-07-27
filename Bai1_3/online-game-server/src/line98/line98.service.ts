import { Injectable } from '@nestjs/common';

interface Ball {
  color: string;
  justBorn: boolean;
}

interface Hint {
  from: [number, number];
  to: [number, number];
}

@Injectable()
export class Line98Service {
  private ROWS = 9;
  private COLS = 9;
  private COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'orange'];
  private BALLS_PER_TURN = 1;

  private board: (Ball | null)[][] = [];
  private selected: [number, number] | null = null;
  private animating: boolean = false;
  private hint: Hint | null = null;
  private msg: string = '';

  getInitialState() {
    this.board = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(null));
    for (let i = 0; i < 5; ++i) this.spawnBall();
    return this.getCurrentState();
  }

  handleMove(row: number, col: number) {
    this.hint = null;
    if (this.animating) return this.getCurrentState();

    if (this.board[row][col]) {
      // Select the ball if clicked on a ball
      this.selected = [row, col];
    } else if (this.selected) {
      // Attempt to move if a ball is selected and the target is empty
      const path = this.findPath(this.selected, [row, col]);
      if (path) {
        this.animating = true;
        this.animateMove(path, () => {
          this.board[row][col] = { ...this.board[this.selected![0]][this.selected![1]]!, justBorn: false };
          this.board[this.selected![0]][this.selected![1]] = null;
          this.selected = null;

          // Check and handle explosion immediately
          const exploded = this.explodeBalls(row, col);
          if (exploded.length > 0) {
            for (const [er, ec] of exploded) {
              this.board[er][ec] = null;
            }
            this.spawnBall();
          } else {
            this.spawnBall();
            // Check for additional explosions after spawning
            let anyExplode = false;
            for (let rr = 0; rr < this.ROWS; ++rr)
              for (let cc = 0; cc < this.COLS; ++cc)
                if (this.board[rr][cc]) {
                  const exploded2 = this.explodeBalls(rr, cc);
                  if (exploded2.length > 0) {
                    anyExplode = true;
                    for (const [er, ec] of exploded2) {
                      this.board[er][ec] = null;
                    }
                  }
                }
            if (!anyExplode) {
              // No additional explosions, ensure state is updated
              this.animating = false;
            }
          }
          this.animating = false; // Ensure animating is reset
        });
      } else {
        // If no valid path, clear selection
        this.selected = null;
      }
    }
    return this.getCurrentState();
  }

  handleRestart() {
    this.selected = null;
    this.animating = false;
    this.hint = null;
    this.msg = '';
    this.board = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(null));
    for (let i = 0; i < 5; ++i) this.spawnBall();
    return this.getCurrentState();
  }

  getHelpMove() {
    if (this.animating) return this.getCurrentState();
    for (let r1 = 0; r1 < this.ROWS; ++r1)
      for (let c1 = 0; c1 < this.COLS; ++c1) {
        if (!this.board[r1][c1]) continue;
        for (let r2 = 0; r2 < this.ROWS; ++r2)
          for (let c2 = 0; c2 < this.COLS; ++c2) {
            if (this.board[r2][c2]) continue;
            const path = this.findPath([r1, c1], [r2, c2]);
            if (path) {
              this.board[r2][c2] = { ...this.board[r1][c1]!, justBorn: false };
              this.board[r1][c1] = null;
              if (this.explodeBalls(r2, c2).length >= 5) {
                this.board[r1][c1] = this.board[r2][c2];
                this.board[r2][c2] = null;
                this.hint = { from: [r1, c1], to: [r2, c2] };
                this.msg = 'Gợi ý: Di chuyển bóng từ (' + (r1 + 1) + ',' + (c1 + 1) + ') đến (' + (r2 + 1) + ',' + (c2 + 1) + ') để nổ hàng!';
                return this.getCurrentState();
              }
              this.board[r1][c1] = this.board[r2][c2];
              this.board[r2][c2] = null;
            }
          }
      }
    for (let r1 = 0; r1 < this.ROWS; ++r1)
      for (let c1 = 0; c1 < this.COLS; ++c1) {
        if (!this.board[r1][c1]) continue;
        for (let r2 = 0; r2 < this.ROWS; ++r2)
          for (let c2 = 0; c2 < this.COLS; ++c2) {
            if (this.board[r2][c2]) continue;
            const path = this.findPath([r1, c1], [r2, c2]);
            if (path) {
              this.hint = { from: [r1, c1], to: [r2, c2] };
              this.msg = 'Gợi ý: Di chuyển bóng từ (' + (r1 + 1) + ',' + (c1 + 1) + ') đến (' + (r2 + 1) + ',' + (c2 + 1) + ')';
              return this.getCurrentState();
            }
          }
      }
    this.hint = null;
    this.msg = 'Không còn nước đi nào!';
    return this.getCurrentState();
  }

  private spawnBall() {
    let empty = [];
    for (let r = 0; r < this.ROWS; ++r)
      for (let c = 0; c < this.COLS; ++c)
        if (!this.board[r][c]) empty.push([r, c]);
    if (empty.length === 0) return;
    let [r, c] = empty[Math.floor(Math.random() * empty.length)];
    let color = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
    this.board[r][c] = { color, justBorn: true };
  }

  private findPath(from: [number, number], to: [number, number]): [number, number][] | null {
    const queue: [number, number][][] = [[from]];
    const visited: boolean[][] = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(false));
    visited[from[0]][from[1]] = true;
    while (queue.length) {
      const path = queue.shift()!;
      const [r, c] = path[path.length - 1];
      if (r === to[0] && c === to[1]) return path;
      for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < this.ROWS && nc >= 0 && nc < this.COLS && !visited[nr][nc] && !this.board[nr][nc]) {
          visited[nr][nc] = true;
          queue.push([...path, [nr, nc]]);
        }
      }
    }
    return null;
  }

  private animateMove(path: [number, number][], cb: () => void) {
    let i = 1;
    const step = () => {
      if (i >= path.length) return cb();
      this.setTimeout(() => { i++; step(); }, 80);
    };
    step();
  }

  private explodeBalls(r: number, c: number): [number, number][] {
    if (r < 0 || r >= this.ROWS || c < 0 || c >= this.COLS) return [];
    const color = this.board[r][c]?.color;
    if (!color) return [];
    let result: [number, number][] = [[r, c]];

    let line: [number, number][] = [[r, c]];
    for (let dc = c - 1; dc >= 0 && this.board[r][dc]?.color === color; --dc) line.push([r, dc]);
    for (let dc = c + 1; dc < this.COLS && this.board[r][dc]?.color === color; ++dc) line.push([r, dc]);
    if (line.length >= 5) result = result.concat(line.filter(([rr, cc]) => !(rr === r && cc === c)));

    line = [[r, c]];
    for (let dr = r - 1; dr >= 0 && this.board[dr][c]?.color === color; --dr) line.push([dr, c]);
    for (let dr = r + 1; dr < this.ROWS && this.board[dr][c]?.color === color; ++dr) line.push([dr, c]);
    if (line.length >= 5) result = result.concat(line.filter(([rr, cc]) => !(rr === r && cc === c)));

    const unique: [number, number][] = [];
    const seen: { [key: string]: number } = {};
    for (const [rr, cc] of result) {
      const key = `${rr},${cc}`;
      if (!seen[key]) { unique.push([rr, cc]); seen[key] = 1; }
    }
    return unique.length >= 5 ? unique : [];
  }

  private setTimeout(cb: () => void, delay: number) {
    setTimeout(cb, delay);
  }

  private getCurrentState() {
    return {
      board: this.board,
      selected: this.selected,
      explodeCells: this.animating && this.selected ? this.explodeBalls(this.selected[0], this.selected[1]) : [],
      hint: this.hint,
      msg: this.msg,
    };
  }
}