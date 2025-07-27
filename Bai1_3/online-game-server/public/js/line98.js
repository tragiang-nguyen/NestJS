  const boardDiv = document.getElementById('board');
    const msg = document.getElementById('msg');

    // Initialize board
    fetch('/line98/init')
      .then(response => response.json())
      .then(data => updateUI(data));

    function updateUI(data) {
      boardDiv.innerHTML = '';
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          if (data.selected && data.selected[0] === r && data.selected[1] === c) cell.classList.add('selected');
          if (data.explodeCells.some(([er, ec]) => er === r && ec === c)) cell.classList.add('explode');
          if (data.hint && ((data.hint.from[0] === r && data.hint.from[1] === c) || (data.hint.to[0] === r && data.hint.to[1] === c))) {
            cell.style.outline = '2px dashed orange';
          }
          cell.onclick = () => makeMove(r, c);
          if (data.board[r][c]) {
            const ball = document.createElement('div');
            ball.className = 'ball ' + data.board[r][c].color;
            cell.appendChild(ball);
          }
          boardDiv.appendChild(cell);
        }
      }
      msg.textContent = data.msg;
    }

    function makeMove(r, c) {
      fetch('/line98/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row: r, col: c })
      })
      .then(response => response.json())
      .then(data => updateUI(data));
    }

    function restart() {
      fetch('/line98/restart', { method: 'POST' })
        .then(response => response.json())
        .then(data => updateUI(data));
    }

    function helpMove() {
      fetch('/line98/help', { method: 'POST' })
        .then(response => response.json())
        .then(data => updateUI(data));
    }