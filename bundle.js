'use strict';

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
        });
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
                checkTotal += (this.map[topLeftPosition.row][topLeftPosition.col + i]);
            } else {
                checkTotal += (this.map[topLeftPosition.row + i][topLeftPosition.col]);
            }
        }
        return (checkTotal === 0) ? true : false
    }

    updateMap(ship) {
        for (let j = -1; j < 2; j++) {
            for (let i = -1; i < ship.length + 1; i++) {
                if (ship.isHorizontal) {
                    this.updateIfOnMap(ship.topLeftPosition.row + j, ship.topLeftPosition.col + i);
                } else {
                    this.updateIfOnMap(ship.topLeftPosition.row + i, ship.topLeftPosition.col + j);
                }
            }
        }
    }

    updateIfOnMap(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.map[row][col] = 1;
        }
    }

    getRandomInt(min, max) {
        // Returns a random number between min (inclusive) and max (exclusive)
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

class Canvas {
    constructor(grid, styleParams, difficulty) {
        this.grid = grid;
        this.styleParams = styleParams;
        this.difficulty = difficulty;
        this.canvasElement = document.getElementById('canvas');
        this.ctx = this.canvasElement.getContext("2d");
    }

    draw () {
        this.drawBlocks(this.grid.rows, this.grid.cols);
        this.drawCounts();
        this.drawGrid(this.grid.rows, this.grid.cols);
    }

    drawCounts() {
        const rowCounts = this.grid.getRowCounts();
        const colCounts = this.grid.getColCounts();

        rowCounts.map((rc, index) =>
            this.drawCount( rc,
                this.grid.cols * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing,
                index * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing));

        colCounts.map((cc, index) =>
            this.drawCount(cc,
                index * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing,
                this.grid.rows * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing
            ));
    }

    drawBlocks(rows, columns) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                const x = c * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing;
                const y = r * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing;
                if (Math.random() < this.difficulty) {
                    this.drawBlock(this.grid.placedMap[r][c], x, y);
                }
            }
        }
    }

    drawGrid(rows, columns) {
        for (let c = 0; c <= columns; c++) {
            for (let r = 0; r <= rows; r++) {
                const x = r * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing;
                const y = c * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing;
                this.drawLine(
                    c * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing,
                    this.styleParams.spacing / 2 + 1,
                    0,
                    rows * (this.styleParams.spacing + this.styleParams.blockSize));
                this.drawLine(
                    this.styleParams.spacing / 2 + 1,
                    r * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing,
                    columns * (this.styleParams.spacing + this.styleParams.blockSize),
                    0);
            }
        }
    }

    drawCount(count, x, y) {
        this.ctx.font = this.styleParams.countFontSize + "px Arial";
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(count, x + this.styleParams.blockSize / 2, y + this.styleParams.blockSize / 2);
    }

    drawLine(x, y, width, height) {
        this.ctx.lineWidth = this.styleParams.lineWidth;
        this.ctx.strokeRect(x, y, width, height);
    }

    drawBlock(blockValue, x, y) {
        switch (blockValue) {
            case 'T':
                this.drawBlockT(x, y);
                break;
            case 'B':
                this.drawBlockB(x, y);
                break;
            case 'L':
                this.drawBlockL(x, y);
                break;
            case 'R':
                this.drawBlockR(x, y);
                break;
            case 'S':
                this.drawBlockS(x, y);
                break;
            case 'M':
                this.drawBlockM(x, y);
                break;
            case 0:
                this.drawBlock0(x, y);
                break;
            default:
                return;
        }
    }

    drawBlockS(x, y) {
        this.ctx.fillStyle = this.styleParams.backgroundColor;
        this.ctx.fillRect(x, y, this.styleParams.blockSize, this.styleParams.blockSize);

        this.ctx.fillStyle = this.styleParams.shipColor;
        this.ctx.beginPath();
        this.ctx.arc(x + this.styleParams.blockSize / 2, y + this.styleParams.blockSize / 2, this.styleParams.blockSize / 2, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawBlockM(x, y) {
        this.ctx.fillStyle = this.styleParams.shipColor;
        this.ctx.fillRect(x, y, this.styleParams.blockSize, this.styleParams.blockSize);
    }

    drawBlockT(x, y) {
        this.ctx.fillStyle = this.styleParams.backgroundColor;
        this.ctx.fillRect(x, y, this.styleParams.blockSize, this.styleParams.blockSize);

        this.ctx.fillStyle = this.styleParams.shipColor;
        this.ctx.beginPath();
        this.ctx.arc(x + this.styleParams.blockSize / 2, y + this.styleParams.blockSize, this.styleParams.blockSize / 2, Math.PI, 2 * Math.PI);
        this.ctx.fill();
    }

    drawBlockB(x, y) {
        this.ctx.fillStyle = this.styleParams.backgroundColor;
        this.ctx.fillRect(x, y, this.styleParams.blockSize, this.styleParams.blockSize);

        this.ctx.fillStyle = this.styleParams.shipColor;
        this.ctx.beginPath();
        this.ctx.arc(x + this.styleParams.blockSize / 2, y, this.styleParams.blockSize / 2, 0, Math.PI);
        this.ctx.fill();
    }

    drawBlockL(x, y) {
        this.ctx.fillStyle = this.styleParams.backgroundColor;
        this.ctx.fillRect(x, y, this.styleParams.blockSize, this.styleParams.blockSize);

        this.ctx.fillStyle = this.styleParams.shipColor;
        this.ctx.beginPath();
        this.ctx.arc(x + this.styleParams.blockSize, y + this.styleParams.blockSize / 2, this.styleParams.blockSize / 2, Math.PI / 2, 3 * Math.PI / 2);
        this.ctx.fill();
    }

    drawBlockR(x, y) {
        this.ctx.fillStyle = this.styleParams.backgroundColor;
        this.ctx.fillRect(x, y, this.styleParams.blockSize, this.styleParams.blockSize);

        this.ctx.fillStyle = this.styleParams.shipColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y + this.styleParams.blockSize / 2, this.styleParams.blockSize / 2, 3 * Math.PI / 2, Math.PI / 2);
        this.ctx.fill();
    }

    drawBlock0(x, y) {
        this.ctx.fillStyle = this.styleParams.backgroundColor;
        this.ctx.fillRect(x, y, this.styleParams.blockSize, this.styleParams.blockSize);
    }
}

const rows = 10;
const columns = 10;
const difficulty = 0.25; // percentage of blocks shown
const shipsToPlace = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
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
console.log(grid.placedMap.map(row => row.map(col => col === 0 ? '_' : col)));

function addButtons () {
    document.getElementById("testButton").addEventListener("click", clickTest);
    // document.getElementById("submitButton").addEventListener("click", submit);
}

function clickTest() {
    const x = 1;
    const y = 1;
    drawCross(x, y);
}

function drawCross(x, y) {
    canvas.ctx.font = styleParams.countFontSize + "px Arial";
    canvas.ctx.fillStyle = 'black';
    canvas.ctx.textAlign = "center";
    canvas.ctx.textBaseline = "middle";
    canvas.ctx.fillText("X", x + styleParams.blockSize / 2, y + styleParams.blockSize / 2);
}
//# sourceMappingURL=bundle.js.map
