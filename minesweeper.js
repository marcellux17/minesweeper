function random(size){
    return Math.floor(Math.random()*size);
}

function generateCoordinates(size, boardMine){
    let xCoordinate = random(size);
    let yCoordinate = random(size);
    if(boardMine.some(mine => mine.x === xCoordinate && mine.y === yCoordinate)){
        return generateCoordinates(size, boardMine);
    }
    return [xCoordinate, yCoordinate];
}

function generateMines(size){
    let mines = [];
    for(let i = 0; i < 40; i++){
        let [xCoordinate, yCoordinate] = generateCoordinates(size, mines);
        let newMine = {"x":xCoordinate, "y":yCoordinate};
        mines.push(newMine);
    }
    return mines;
}

function isItMine(mines, xCoordinate, yCoordinate){
    return mines.some(mine => mine.x === xCoordinate && mine.y === yCoordinate);
}

function countAdjacentMines(mines, tile){
    let adjacentMines = 0;
    let count = 0;
    let xCoordinate = tile.x;
    let yCoordinate = tile.y;
    let possibleTiles = [
        {"x": xCoordinate-1, "y": yCoordinate-1},
        {"x": xCoordinate, "y": yCoordinate-1},
        {"x": xCoordinate+1, "y": yCoordinate-1},
        {"x": xCoordinate-1, "y": yCoordinate},
        {"x": xCoordinate+1, "y": yCoordinate},
        {"x": xCoordinate-1, "y": yCoordinate+1},
        {"x": xCoordinate, "y": yCoordinate+1},
        {"x": xCoordinate+1, "y": yCoordinate+1}
    ]
    while(count<8){
        if(mines.some(mine => mine.x === possibleTiles[count].x && mine.y === possibleTiles[count].y)){
            adjacentMines++;
        }
        count++;
    }
    return adjacentMines;
}

function createTilesWithNumbers(size, mines){
    let tilesWithNumbers = [];
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            if(!isItMine(mines, i, j)){
                let newTilewithNumber = {
                    "x": i,
                    "y": j,
                    "adjacentMines": undefined
                };
                newTilewithNumber.adjacentMines = countAdjacentMines(mines, newTilewithNumber)
                tilesWithNumbers.push(newTilewithNumber)
            }
        }
    }
    return tilesWithNumbers;
}

function createBoard(size, tiles, board){
    if(tiles){
        board.innerHTML = "";
    }
    const mines = generateMines(size);
    const tilesWithNumbers = createTilesWithNumbers(size, mines);
    for(let i = 0; i < size**2; i++){
        let newTile = `<div class="tile" data-status="hidden"></div>`
        board.innerHTML += newTile;
    }
    return [mines, tilesWithNumbers];
}

export {createBoard, isItMine};