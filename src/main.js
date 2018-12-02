import {Grid} from'./Grid.js';
import {Canvas} from'./Canvas.js';

const rows = 10;
const columns = 10;
const difficulty = 0.25; // percentage of blocks shown
const shipsToPlace = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
let grid = new Grid(rows, columns, shipsToPlace);

var styleParams = {
    backgroundColor: '#33E8FF',
    shipColor: '#636363',
    blockSize: 20,
    countFontSize: 15,
    lineWidth: 2,
    spacing: 1,
};

let canvas = new Canvas(grid, styleParams, difficulty);
canvas.draw();
addButtons();
console.log(grid.placedMap.map(row => row.map(col => col === 0 ? '_' : col)))

function addButtons () {
    document.getElementById("testButton").addEventListener("click", clickTest);
    // document.getElementById("submitButton").addEventListener("click", submit);
}

function clickTest() {
    const x = 1;
    const y = 1;
    drawCross(x, y)
}

function drawCross(x, y) {
    canvas.ctx.font = styleParams.countFontSize + "px Arial";
    canvas.ctx.fillStyle = 'black';
    canvas.ctx.textAlign = "center";
    canvas.ctx.textBaseline = "middle";
    canvas.ctx.fillText("X", x + styleParams.blockSize / 2, y + styleParams.blockSize / 2);
}

