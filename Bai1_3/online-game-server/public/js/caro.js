  const boardDiv = document.getElementById('board');
    const status = document.getElementById('status');
    const restartBtn = document.getElementById('restartBtn');

    // Khởi tạo board
    fetch('/caro/init')
      .then(response => response.json())
      .then(data => updateBoard(data));

    function updateBoard(data) {
      boardDiv.innerHTML = '';
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.row = i;
          cell.dataset.col = j;
          cell.addEventListener('click', () => makeMove(i, j));
          if (data.board[i][j]) cell.textContent = data.board[i][j];
          boardDiv.appendChild(cell);
        }
      }
      status.textContent = data.status;
    }

    function makeMove(row, col) {
      fetch('/caro/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row, col })
      })
      .then(response => response.json())
      .then(data => {
        updateBoard(data);
        if (!data.gameActive) document.getElementById('msg').textContent = data.message || '';
      });
    }

    restartBtn.addEventListener('click', () => {
      fetch('/caro/restart', { method: 'POST' })
        .then(response => response.json())
        .then(data => updateBoard(data));
    });