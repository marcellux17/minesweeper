import {createBoard, isItMine} from "./minesweeper.js";

let gameBoard = document.querySelector("#game-field");
let tiles = gameBoard.querySelectorAll("div.tiles");
let gameStatusDOM = document.querySelector("#game-status");
let restart = document.querySelector("button")
let gamestatus = "going";
let size = 16;
let numberOfrevealedTiles = 0;
document.documentElement.style.setProperty("--size", size)
let numberOfMines = 40;
let showNumberOfMinesDOM = document.querySelector("span#mines");
showNumberOfMinesDOM.textContent = numberOfMines;
let [mines, tilesWithNumbers] = createBoard(size, tiles, gameBoard);

//deriving the coordinates from the nth element
function deriveCoordinates(n, size){
    let y = Math.floor(n/size);
    let x = n%size;
    return [x, y];
}
function findIndexOfTile(board, elem){
    let indexOf = 0;
    Array.from(board).forEach((tile, i)=> {
        if(tile === elem){
            indexOf = i;
        }
    })
    return indexOf;
}
function findTile(x, y, tileswithnums){
    let foundTile;
    tileswithnums.forEach(tile => {
        if(tile.x === x && tile.y === y){
            foundTile = tile;
        } 
    })
    return foundTile;
}

function revealTile(tile, mines, tiles, size, tileswithnums){
    let indexOfTile = findIndexOfTile(tiles, tile);
    let [x, y] = deriveCoordinates(indexOfTile, size);
    if(isItMine(mines, x, y)){
        gameStatusDOM.textContent = "You lose";
        gamestatus = "notgoing";
        Array.from(tiles)[indexOfTile].dataset.mine = "clicked";
        revealMines(mines, tiles, size);
        checkForWrongTiles(tiles, tileswithnums, size)
    }else{
        revealtiles(x, y, tiles, size, tileswithnums);
        if(numberOfrevealedTiles === size**2 - mines.length){
            gamestatus = "notgoing"
        }
    }
}

function revealtiles(x, y, tiles, size, tileswithnums){
    let foundTile = findTile(x, y, tileswithnums);
    let indexOfTile;
    if(foundTile){
        indexOfTile = y*size + x;
    }
    if(foundTile && foundTile.adjacentMines > 0 && Array.from(tiles)[indexOfTile].dataset.status !== "shown"){
        Array.from(tiles)[indexOfTile].dataset.status = "shown";
        numberOfrevealedTiles++;
        checkForWin()
        Array.from(tiles)[indexOfTile].textContent = foundTile.adjacentMines;
        return Array.from(tiles)[indexOfTile].dataset.adjacent = foundTile.adjacentMines;
    }else if(foundTile && foundTile.adjacentMines === 0 && Array.from(tiles)[indexOfTile].dataset.status !== "shown"){
        Array.from(tiles)[indexOfTile].dataset.status = "shown";
        numberOfrevealedTiles++;
        checkForWin();
        let adjacentTiles = [
            {"x": x-1, "y": y-1},
            {"x": x, "y": y-1},
            {"x": x-1, "y": y},
            {"x": x+1, "y": y-1},
            {"x": x+1, "y": y},
            {"x": x-1, "y": y+1},
            {"x": x, "y": y+1},
            {"x": x+1, "y": y+1}
        ];
        adjacentTiles.forEach(tile => {
            revealtiles(tile.x, tile.y, tiles, size, tileswithnums);
        })

    }else{
        return;
    }
}
function checkForWrongTiles(board, tileswithnums, size){
    Array.from(board).forEach((tile, i) => {
        let [ x, y] = deriveCoordinates(i, size);
        let foundTile = findTile(x,y,tileswithnums);
        if(tile.innerHTML === `<img src="./img/flag_icon.png">` && foundTile){
            tile.innerHTML += `<img class='wrong' src="./img/wrong_icon.png">`;
        }
    })
}
function revealMines(mines, tiles, size){
    mines.forEach(mine => {
        let indexOfMine = mine.y*size + mine.x;
        let foundMine = Array.from(tiles)[indexOfMine];
        foundMine.dataset.status = "shown";
        let img = `<img src="img/mine_icon.jpg">`;
        foundMine.innerHTML = img;
    })
}
function checkForWin(){
    if(numberOfrevealedTiles === size**2-mines.length){
        gamestatus = "notgoing";
        gameStatusDOM.textContent = "You win";
    } ;
}
gameBoard.addEventListener("click", e => {
    tiles = gameBoard.querySelectorAll("div.tile");
    if(gamestatus === "going"){
        if(e.target.dataset.status === "hidden"){
            revealTile(e.target, mines, tiles, size, tilesWithNumbers);
            checkForWin();
        }
    }
})
function updateNumberOfMines({csökken = true, nő = false}){
    if(csökken === true){
        numberOfMines--;
        showNumberOfMinesDOM.textContent = numberOfMines;
    }else{
        numberOfMines++;
        showNumberOfMinesDOM.textContent = numberOfMines;
    }
}
gameBoard.addEventListener("contextmenu", e => {
    e.preventDefault();
    tiles = gameBoard.querySelectorAll("div.tile");
    if(gamestatus === "going"){
        if(e.target.dataset.status === "hidden" || e.target.matches("img")){
            if(e.target.matches("img")){
                e.target.parentElement.dataset.status = "hidden";
                e.target.remove();
                updateNumberOfMines({csökken: false, nő:true})
            }else{
                let img = `<img src="./img/flag_icon.png">`
                e.target.innerHTML = img;
                e.target.dataset.status = "flag";
                updateNumberOfMines({});
            }
        }else if(e.target.matches("div.tile") && e.target.dataset.status !== "shown"){
            e.target.innerHTML = "";
            e.target.dataset.status = "hidden";
            updateNumberOfMines({csökken: false, nő:true})
        }
    }
})

function restartFunction(e){
    gamestatus = "going";
    gameStatusDOM.textContent = "";
    numberOfMines = 40;
    numberOfrevealedTiles = 0;
    showNumberOfMinesDOM.textContent = numberOfMines;
    let [newmines, newtilesWithNumbers] = createBoard(size, tiles, gameBoard);
    mines = newmines;
    tilesWithNumbers = newtilesWithNumbers;
}
restart.addEventListener("click", restartFunction)