const size = 10;
const mines = 10;
let board = [];
let gameOver = false;

function startGame() {
    gameOver = false;
    board = Array(size).fill().map(() => Array(size).fill().map(() => ({
        isMine: false,
        revealed: false,
        flagged: false,
        count: 0
    })));

    let placed = 0;
    while (placed < mines) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (!board[x][y].isMine) {
            board[x][y].isMine = true;
            placed++;
        }
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j].isMine) continue;

            let count = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (i+x >= 0 && i+x < size && j+y >= 0 && j+y < size && board[i+x][j+y].isMine) {
                        count++;
                    }
                }
            }
            board[i][j].count = count;
        }
    }

    document.getElementById('board').innerHTML = '';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.dataset.row = i;
            cell.dataset.col = j;

            cell.addEventListener('click', () => handleLeftClick(i, j));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleRightClick(i, j);
            });

            document.getElementById('board').appendChild(cell);
        }
    }
}

function handleLeftClick(i, j) {
    if (gameOver || board[i][j].revealed || board[i][j].flagged) return;

    const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
    cell.classList.add('revealed');
    board[i][j].revealed = true;

    if (board[i][j].isMine) {
        cell.textContent = 'X';
        cell.classList.add('mine');
        
        setTimeout(() => {
            revealAllMines();
            gameOver = true;
            alert('Przegrałeś!');
        }, 100);
        return;
    }


    if (board[i][j].count > 0) {
        cell.textContent = board[i][j].count;
    } else {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (i+x >= 0 && i+x < size && j+y >= 0 && j+y < size && !board[i+x][j+y].revealed) {
                    handleLeftClick(i+x, j+y);
                }
            }
        }
    }
}

function handleRightClick(i, j) {
    if (gameOver || board[i][j].revealed) return;

    const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
    board[i][j].flagged = !board[i][j].flagged;

    if (board[i][j].flagged) {
        cell.textContent = '🚩';
        cell.classList.add('flagged');
    } else {
        cell.textContent = '';
        cell.classList.remove('flagged');
    }
}

function revealAllMines() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j].isMine) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cell.textContent = 'X';
                cell.classList.add('mine');
                cell.classList.add('revealed');
            }
        }
    }
}

document.getElementById('new-game').addEventListener('click', startGame);
startGame();