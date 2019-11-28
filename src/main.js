import {Grid} from'./Grid.js';
import {Canvas} from'./Canvas.js';


const rows = 10;
const columns = 10;
const difficulty = 1; // percentage of blocks shown
const shipsToPlace = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]

var styleParams = {
    backgroundColor: '#33E8FF',
    shipColor: '#636363',
    blockSize: 20,
    countFontSize: 15,
    lineWidth: 2,
    spacing: 1,
};

let grid = new Grid(rows, columns, shipsToPlace, difficulty);
let canvas = new Canvas(grid, styleParams, difficulty);
canvas.draw();

console.log(grid.questionMap)
console.log(grid.answerMap)
