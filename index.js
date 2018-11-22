class Ship {
    constructor(length) {
        this.length = length;
        this.isHorizontal = this.getOrientation();
        this.topLeftPosition = { row: 0, col: 0 };
    }

    getOrientation() {
        return (Math.round(Math.random())) === 1 ? true : false;
    }
}

class Grid {
    constructor(rows, cols, shipsToPlace) {
        this.rows = rows;
        this.cols = cols;
        this.shipsToPlace = shipsToPlace;
        this.map = this.createMap();
        this.placedShips = this.getPlacedShips();
        this.placedMap = this.displayShips();
    }

    getRowCounts() {
        return this.placedMap.map(r => this.getCounts(r))
    }

    getColCounts() {
        // transposes array
        const cols = this.placedMap[0].map((col, i) => this.placedMap.map(row => row[i]));
        return cols.map(c => this.getCounts(c))
    }

    getCounts(set) {
        return set.filter(s => s !== 0).length
    }

    createMap() {
        return Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }

    displayShips() {
        let map = this.createMap();
        this.placedShips.map(s => {
            for (let i = 0; i < s.length; i++) {

                if (s.length === 1) {
                    map[s.topLeftPosition.row][s.topLeftPosition.col + i] = 'S';
                } else if (i === 0) {
                    s.isHorizontal
                        ? map[s.topLeftPosition.row][s.topLeftPosition.col + i] = 'L'
                        : map[s.topLeftPosition.row + i][s.topLeftPosition.col] = 'T';
                } else if (i === s.length - 1) {
                    s.isHorizontal
                        ? map[s.topLeftPosition.row][s.topLeftPosition.col + i] = 'R'
                        : map[s.topLeftPosition.row + i][s.topLeftPosition.col] = 'B';
                } else {
                    s.isHorizontal
                        ? map[s.topLeftPosition.row][s.topLeftPosition.col + i] = 'M'
                        : map[s.topLeftPosition.row + i][s.topLeftPosition.col] = 'M';
                }
            }
        })
        return map;
    }

    getPlacedShips() {
        const placedShips = [];
        this.shipsToPlace.map(s => placedShips.push(this.placeShip(s)));
        return placedShips;
    }

    placeShip(shipLength) {
        let ship = new Ship(shipLength);
        let isPositionValid = false;
        let topLeftPosition = { row: 0, col: 0 };
        while (isPositionValid === false) {
            if (ship.isHorizontal) {
                topLeftPosition.row = this.getRandomInt(0, this.rows);
                topLeftPosition.col = this.getRandomInt(0, (this.cols - shipLength + 1));
            } else {
                topLeftPosition.row = this.getRandomInt(0, (this.rows - shipLength + 1));
                topLeftPosition.col = this.getRandomInt(0, this.cols);
            }
            isPositionValid = this.checkIfPositionIsValid(ship, topLeftPosition);
        }
        ship.topLeftPosition = topLeftPosition;
        this.updateMap(ship, topLeftPosition);
        return ship;
    }

    checkIfPositionIsValid(ship, topLeftPosition) {
        let checkTotal = 0;
        for (let i = 0; i < ship.length; i++) {
            if (ship.isHorizontal) {
                checkTotal += (this.map[topLeftPosition.row][topLeftPosition.col + i])
            } else {
                checkTotal += (this.map[topLeftPosition.row + i][topLeftPosition.col])
            }
        }
        return (checkTotal === 0) ? true : false
    }

    updateMap(ship) {
        for (let j = -1; j < 2; j++) {
            for (let i = -1; i < ship.length + 1; i++) {
                if (ship.isHorizontal) {
                    this.updateIfOnMap(ship.topLeftPosition.row + j, ship.topLeftPosition.col + i)
                } else {
                    this.updateIfOnMap(ship.topLeftPosition.row + i, ship.topLeftPosition.col + j)
                }
            }
        }
    }

    updateIfOnMap(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.map[row][col] = 1
        }
    }

    getRandomInt(min, max) {
        // Returns a random number between min (inclusive) and max (exclusive)
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

const rows = 10;
const columns = 20;
const difficulty = 0.25; // percentage of blocks shown

const shipsToPlace =
    [4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1]
let grid = new Grid(rows, columns, shipsToPlace);

console.log(grid.placedMap)
console.log(grid.getRowCounts())
console.log(grid.getColCounts())

console.log(Math.random())

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var styleParams = {
    backgroundColor: '#33E8FF',
    shipColor: '#636363',
    blockSize: 20,
    countFontSize: 15,
    lineWidth: 2,
    spacing: 1,
};

drawBlocks(rows, columns, ctx, styleParams, difficulty);
drawCounts(grid, ctx, styleParams);
drawGrid(rows, columns, ctx, styleParams);

document.getElementById("button").addEventListener("click", changeColour);

function changeColour() {
    const x = 0 * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing;
    const y = 0 * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing;
    drawCross(ctx, styleParams, x, x)
}


function drawCross(ctx, styleParams, x, y) {
    ctx.font = styleParams.countFontSize + "px Arial";
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("X", x + styleParams.blockSize / 2, y + styleParams.blockSize / 2);
}

function drawCounts(grid, ctx, styleParams) {
    const rowCounts = grid.getRowCounts();
    const colCounts = grid.getColCounts();

    rowCounts.map((rc, index) =>
        drawCount(ctx, styleParams, rc,
            columns * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing,
            index * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing))

    colCounts.map((cc, index) =>
        drawCount(ctx, styleParams, cc,
            index * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing,
            rows * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing
        ))
}

function drawBlocks(rows, columns, ctx, styleParams, difficulty) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const x = c * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing;
            const y = r * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing;
            if (Math.random() < difficulty) {
                drawBlock(grid.placedMap[r][c], ctx, styleParams, x, y)
            }
        }
    }
}

function drawGrid(rows, columns, ctx, styleParams) {
    for (let c = 0; c <= columns; c++) {
        for (let r = 0; r <= rows; r++) {
            const x = r * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing;
            const y = c * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing;
            drawLine(ctx, styleParams,
                c * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing,
                styleParams.spacing / 2 + 1,
                0,
                rows * (styleParams.spacing + styleParams.blockSize))
            drawLine(ctx, styleParams,
                styleParams.spacing / 2 + 1,
                r * (styleParams.spacing + styleParams.blockSize) + styleParams.spacing,
                columns * (styleParams.spacing + styleParams.blockSize),
                0)
        }
    }
}

function drawBlockS(ctx, styleParams, x, y) {
    ctx.fillStyle = styleParams.backgroundColor;
    ctx.fillRect(x, y, styleParams.blockSize, styleParams.blockSize);

    ctx.fillStyle = styleParams.shipColor;
    ctx.beginPath();
    ctx.arc(x + styleParams.blockSize / 2, y + styleParams.blockSize / 2, styleParams.blockSize / 2, 0, 2 * Math.PI);
    ctx.fill();
}

function drawBlockM(ctx, styleParams, x, y) {
    ctx.fillStyle = styleParams.shipColor;
    ctx.fillRect(x, y, styleParams.blockSize, styleParams.blockSize);
}

function drawBlockT(ctx, styleParams, x, y) {
    ctx.fillStyle = styleParams.backgroundColor;
    ctx.fillRect(x, y, styleParams.blockSize, styleParams.blockSize);

    ctx.fillStyle = styleParams.shipColor;
    ctx.beginPath();
    ctx.arc(x + styleParams.blockSize / 2, y + styleParams.blockSize, styleParams.blockSize / 2, Math.PI, 2 * Math.PI);
    ctx.fill();
}

function drawBlockB(ctx, styleParams, x, y) {
    ctx.fillStyle = styleParams.backgroundColor;
    ctx.fillRect(x, y, styleParams.blockSize, styleParams.blockSize);

    ctx.fillStyle = styleParams.shipColor;
    ctx.beginPath();
    ctx.arc(x + styleParams.blockSize / 2, y, styleParams.blockSize / 2, 0, Math.PI);
    ctx.fill();
}

function drawBlockL(ctx, styleParams, x, y) {
    ctx.fillStyle = styleParams.backgroundColor;
    ctx.fillRect(x, y, styleParams.blockSize, styleParams.blockSize);

    ctx.fillStyle = styleParams.shipColor;
    ctx.beginPath();
    ctx.arc(x + styleParams.blockSize, y + styleParams.blockSize / 2, styleParams.blockSize / 2, Math.PI / 2, 3 * Math.PI / 2);
    ctx.fill();
}

function drawBlockR(ctx, styleParams, x, y) {
    ctx.fillStyle = styleParams.backgroundColor;
    ctx.fillRect(x, y, styleParams.blockSize, styleParams.blockSize);

    ctx.fillStyle = styleParams.shipColor;
    ctx.beginPath();
    ctx.arc(x, y + styleParams.blockSize / 2, styleParams.blockSize / 2, 3 * Math.PI / 2, Math.PI / 2);
    ctx.fill();
}

function drawBlock0(ctx, styleParams, x, y) {
    ctx.fillStyle = styleParams.backgroundColor;
    ctx.fillRect(x, y, styleParams.blockSize, styleParams.blockSize);
}

function drawCount(ctx, styleParams, count, x, y) {
    // ctx.font = "Arial";
    ctx.font = styleParams.countFontSize + "px Arial";
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(count, x + styleParams.blockSize / 2, y + styleParams.blockSize / 2);
}

function drawLine(ctx, styleParams, x, y, width, height) {
    ctx.lineWidth = styleParams.lineWidth;
    ctx.strokeRect(x, y, width, height);
}

function drawBlock(blockValue, ctx, styleParams, x, y) {
    switch (blockValue) {
        case 'T':
            drawBlockT(ctx, styleParams, x, y);
            break;
        case 'B':
            drawBlockB(ctx, styleParams, x, y);
            break;
        case 'L':
            drawBlockL(ctx, styleParams, x, y);
            break;
        case 'R':
            drawBlockR(ctx, styleParams, x, y);
            break;
        case 'S':
            drawBlockS(ctx, styleParams, x, y);
            break;
        case 'M':
            drawBlockM(ctx, styleParams, x, y);
            break;
        case 0:
            drawBlock0(ctx, styleParams, x, y);
            break;
        default:
            return;
    }
}

