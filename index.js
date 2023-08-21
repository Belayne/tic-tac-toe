
const Gameboard = (() => {
    const board = ["","","","","","","","",""];

    const addMark = (index, mark) => {
        board[index] = mark;
    }

    const reset = () => {
        for(let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    const getBoard = () => board;

    return {
        reset,
        getBoard,
        addMark
    }
})();

const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;

    return {getName, getMark}
}

const GameController = (() => {
    const playerOne = Player("Player One", "X")
    const playerTwo = Player("Player Two", "O")
    const WIN_CONDITIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const board = Gameboard.getBoard();
    const gameStatus = {
        state: "Playing",
        winner: ""
    }

    let currentPlayer = playerOne;

    const switchPlayer = () => {
        currentPlayer = (currentPlayer == playerOne)? playerTwo: playerOne;
    }

    const playRound = (index) => {
        if(!board[index]) {
            Gameboard.addMark(index, currentPlayer.getMark());
            checkWin();
            if(gameStatus.state == "Playing") {
                switchPlayer();
            }
        }
        console.table(Gameboard.getBoard())
        console.table(gameStatus);
    }

    const checkWin = () => {
        const playerPositions = board.map((a, index) => {
            if(a === currentPlayer.getMark()) return index;
        });

        if(playerPositions.length > 2) {
            if(WIN_CONDITIONS.some(winArr => winArr.every(a => playerPositions.includes(a)))) {
                gameStatus.state = "Game Won"
                gameStatus.winner = currentPlayer.getName();
            }
            else if(board.every(el => el != "")) {
                gameStatus.state = "Draw"
            }
        }
    }

    const reset = () => {
        Gameboard.reset();
        gameStatus.state = "Playing",
        gameStatus.winner = "";
        currentPlayer = playerOne;
    }

    const getGameStatus = () => gameStatus;
    const getCurrentPlayer = () => currentPlayer;

    return {
        getGameStatus,
        getCurrentPlayer,
        playRound,
        reset
    }

})();

const DisplayController = (() => {
    const boardDiv = document.querySelector(".board")
    const messageDiv = document.querySelector(".message");
    const board = Gameboard.getBoard();

    const pickMessage = (state) => {
        let message = (state === "Playing")? `It's ${GameController.getCurrentPlayer().getName()}'s turn.`:
            (state === "Draw")? `It's a Draw!`: `${GameController.getGameStatus().winner} wins!`;
        
        return message;
    }

    const createGrid = (() => {
        for(let i = 0; i < 9; i++){
            let gridItem = document.createElement('div');
            gridItem.classList.add('grid-item')
            gridItem.setAttribute('data-id', i)
            boardDiv.appendChild(gridItem);
        }
    })();

    const addResetBtn = (() => {
        const resetBtn = document.createElement('button');
        resetBtn.setAttribute('type', 'button');
        resetBtn.classList.add('reset-btn');
        resetBtn.textContent = "Reset";
        resetBtn.addEventListener("click", resetClick)
        boardDiv.parentElement.appendChild(resetBtn);
    })()

    function resetClick() {
        GameController.reset();
        clearGrid();
        updateMessage();
    }

    function clearGrid() {
        for(let gridItem of boardDiv.childNodes) {
            gridItem.textContent = "";
        }
    }

    function updateGrid(index){
        const clickedItem =  boardDiv.querySelector(`.grid-item[data-id="${index}"]`);
        clickedItem.textContent = board[index];
    }

    const updateMessage = () => {
        let gameState = GameController.getGameStatus().state;
        let message = pickMessage(gameState);
        
        console.log(message)
        messageDiv.querySelector('p').textContent = message;
    };

    updateMessage();

    function playerClick(e) {
        if(GameController.getGameStatus().state === "Playing") {
            const index = +e.target.getAttribute('data-id')
            GameController.playRound(index);
            updateGrid(index);
            updateMessage();
        }
    }

    boardDiv.addEventListener("click", playerClick)

})();


