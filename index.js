const Gameboard = (() => {
    const board = ["X","X","X","O","O","O","X","X","X"];

    const createGrid = (cont) => {
        for(let i = 0; i < 9; i++){
            let gridItem = document.createElement('div');
            gridItem.classList.add('grid-item')
            gridItem.setAttribute('data-id', i)
            gridItem.textContent = board[i];
            cont.appendChild(gridItem);
        }
    }

    return {
        board,
        createGrid,
    }
})();

Gameboard.createGrid(document.querySelector('.container'));