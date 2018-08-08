const Grid = require('./grid');
const Ship = require('./ship');

const shipsToPlace = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
let grid = new Grid(10, 20, shipsToPlace);

console.log(grid.placedMap)
console.log(grid.getRowCounts())
console.log(grid.getColCounts())