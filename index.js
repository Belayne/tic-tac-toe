const Gameboard = (() => {
    const board = ["","","","","","","","",""];

    const addMark = (index, mark) => {
        board[index] = mark;
    }

    const getBoard = () => board;

    return {
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
    const playerOne = Player("One", "X")
    const playerTwo = Player("Two", "O")
    const board = Gameboard.getBoard();

    let currentPlayer = playerOne;

    const switchPlayer = () => {
        currentPlayer = (currentPlayer == playerOne)? playerTwo: playerOne;
        console.log(currentPlayer.getName())
    }

    const playRound = (index) => {
        if(!board[index]) {
            Gameboard.addMark(index, currentPlayer.getMark());
            switchPlayer();
        }
        else {
            console.log("Already Played")
        }
        console.log(Gameboard.getBoard())
    }

    const getCurrentPlayer = () => currentPlayer;

    return {
        getCurrentPlayer,
        playRound
    }

})();

const DisplayController = (() => {
    const boardDiv = document.querySelector(".board")
    const messageDiv = document.querySelector(".message");

    const createGrid = (() => {
        for(let i = 0; i < 9; i++){
            let gridItem = document.createElement('div');
            gridItem.classList.add('grid-item')
            gridItem.setAttribute('data-id', i)
            boardDiv.appendChild(gridItem);
        }
    })();

    function updateGrid(index){
        const clickedItem =  boardDiv.querySelector(`.grid-item[data-id="${index}"]`);
        clickedItem.textContent = Gameboard.getBoard()[index];
    }

    const updateMessage = () => {
        messageDiv.querySelector('p').textContent = `It's ${GameController.getCurrentPlayer().getName()}'s turn.`;
    };

    updateMessage();

    function playerClick(e) {
        const index = +e.target.getAttribute('data-id')
        GameController.playRound(index);
        updateGrid(index);
        updateMessage();
    }

    boardDiv.addEventListener("click", playerClick)

})();


