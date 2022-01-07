const Player = (marker, name) => {
    let score = 0;
    const getMarker = () => marker;
    const getName = () => name;
    const increaseScore = () => score++;
    const getScore = () => score;
    const setName = (str) => {
        name = str;
    }
    return {getMarker, getName, getScore, increaseScore, setName};
};

const gameBoard = (() => {
    let board = [['','',''],['','',''],['','','']];

    const getBoard = () => {
        return board;
    }

    const changeSquare = (rowIndex, colIndex, marker) => {
        board[rowIndex][colIndex] = marker;
    }

    const resetBoard = () => {
        board = [['','',''],['','',''],['','','']];
    }

    const checkForWinner = (player) => {
        const marker = player.getMarker();
        for (let i = 0; i < 3; i++) {
            if (marker === board[i][0] && marker === board[i][1] && marker === board[i][2]) {
                return player;
            } else if (marker === board[0][i] && marker === board[1][i] && marker === board[2][i]) {
                return player;
            }
        }
        if (marker === board[0][0] && marker === board[1][1] && marker === board[2][2]) {
            return player;
        } else if (marker === board[2][0] && marker === board[1][1] && marker === board[0][2]) {
            return player;
        }
        return null;
    }

    const checkForTie = () => {
        let ret = true;
        board.forEach((row) => {
            if (row.includes('')) {
                ret = false;
            }
        });
        return ret;
    }

    // Put player's marker in square when clicked, then checks for the end of the game and changes players
    const placeMarker = (square) => {
        if (board[square.dataset.row][square.dataset.column] === '' && displayController.getPlaying()) {
            changeSquare(square.dataset.row, square.dataset.column, displayController.getCurrentPlayer().getMarker());
            const winner = checkForWinner(displayController.getCurrentPlayer());
            if (winner || checkForTie()) {
                displayController.declareWinner(winner);
            } else {
                displayController.changePlayer();
            }
            render();
        }
    }

    // display the game board to the screen
    const render = () => {

        const boardContainer = document.querySelector('.board-container');
        while (boardContainer.firstChild) {
            boardContainer.removeChild(boardContainer.lastChild);
        }
        let rowIndex = 0;
        board.forEach((element) => {
            const row = document.createElement('div');
            row.classList.add('row');
            let colIndex = 0;
            element.forEach((squelement) => {
                const square = document.createElement('div');
                square.classList.add('square');
                square.textContent = squelement;
                square.dataset.row = rowIndex;
                square.dataset.column = colIndex;
                square.addEventListener('click', () => placeMarker(square));
                row.appendChild(square);
                colIndex++;
            });
            boardContainer.appendChild(row);
            rowIndex++;
        });
    };

    return {getBoard, render, changeSquare, resetBoard};
})();

const displayController = (() => {
    const players = [Player('X', '1'), Player('O', '2')];
    let currentPlayer = players[0];
    let playing = false;

    const getCurrentPlayer = () => currentPlayer;

    const getPlaying = () => playing;

    // end the game
    const declareWinner = (player => {
        if (player) {
            alert(`${player.getName()} wins!`);
        } else {
            alert('nobody wins!');
        }
        playing = false;

        
        playButton.style.display = 'block';
    });

    const startGame = () => {
        gameBoard.resetBoard();
        gameBoard.render();
        playing = true;
        currentPlayer = players[0];
        players[0].setName(prompt("player 1 name"));
        players[1].setName(prompt("player 2 name"));
    }

    const changePlayer = () => {
        if (currentPlayer === players[0]) {
            currentPlayer = players[1];
        } else {
            currentPlayer = players[0];
        }
    }
    return {changePlayer, getCurrentPlayer, declareWinner, getPlaying, startGame};
})();



gameBoard.render();
const playButton = document.querySelector('.play-button');
playButton.addEventListener('click', () => {
    playButton.style.display = 'none';
    displayController.startGame();
})