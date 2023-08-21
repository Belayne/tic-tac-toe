
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
    let playerOne;
    let playerTwo;
    let currentPlayer;
    const WIN_CONDITIONS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const board = Gameboard.getBoard();
    const gameStatus = {
        state: "Start",
        winner: ""
    }

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
    const startGame = (playerOneName, playerTwoName) => {
        gameStatus.state = "Playing";
        playerOne = Player(playerOneName, "X");
        playerTwo = Player(playerTwoName, "O");
        currentPlayer = playerOne;
    }

    return {
        getGameStatus,
        getCurrentPlayer,
        playRound,
        reset,
        startGame
    }

})();

const DisplayController = (() => {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add('board');
    const startForm = document.querySelector('.start-form');
    const messageDiv = document.querySelector(".message");
    const startBtn = document.querySelector(".start-btn");
    const board = Gameboard.getBoard();

    //Gets players' names, removes start screen, creates the board and starts the game
    const createGame = () => {
        const playerOneName = document.querySelector('#playerOne').value;
        const playerTwoName = document.querySelector('#playerTwo').value;
        startForm.insertAdjacentElement("beforebegin", boardDiv);
        startForm.removeChild(startBtn)
        document.querySelector('body').removeChild(startForm)
        createResetBtn();

        for(let i = 0; i < 9; i++){
            let gridItem = document.createElement('div');
            gridItem.classList.add('grid-item')
            gridItem.setAttribute('data-id', i)
            boardDiv.appendChild(gridItem);
        }

        GameController.startGame(playerOneName, playerTwoName);
        updateMessage();
    }

    const createResetBtn = () => {
        const resetBtn = document.createElement('button');
        resetBtn.setAttribute('type', 'button');
        resetBtn.classList.add('reset-btn');
        resetBtn.textContent = "Reset";
        resetBtn.addEventListener("click", onResetClick)
        boardDiv.parentElement.appendChild(resetBtn);
    }

    function onResetClick() {
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

    const pickMessage = (state) => {
        switch(state) {
            case "Start": { 
                message = "Enter your name, X goes first.";
                break;
            }
            case "Playing": {
                message = `It's ${GameController.getCurrentPlayer().getName()}'s (${GameController.getCurrentPlayer().getMark()}) turn.`;
                break;
            }
            case "Draw": {
                message = `It's a Draw!`;
                break;
            }
            case "Game Won": {
                message = `${GameController.getGameStatus().winner} wins!`;
                break;
            }
        }
        
        return message;
    }

    //Set inital message
    updateMessage();

    function playerClick(e) {
        if(GameController.getGameStatus().state === "Playing") {
            const index = +e.target.getAttribute('data-id')
            GameController.playRound(index);
            updateGrid(index);
            updateMessage();
        }
    }
    
    startForm.addEventListener("submit", createGame)

    boardDiv.addEventListener("click", playerClick)

})();


