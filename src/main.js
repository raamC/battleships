const fs = require('fs') 

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
    constructor(rows, cols, shipsToPlace, difficulty) {
        this.rows = rows;
        this.cols = cols;
        this.shipsToPlace = shipsToPlace;
        this.difficulty = difficulty;
        this.map = this.createMap();
        this.placedShips = this.getPlacedShips();
        this.answerMap = this.getAnswerMap();
        this.questionMap = this.getQuestionMap();
    }

    getRowCounts() {
        return this.answerMap.map(r => this.getCounts(r))
    }

    getColCounts() {
        // transposes array
        const cols = this.answerMap[0].map((col, i) => this.answerMap.map(row => row[i]));
        return cols.map(c => this.getCounts(c))
    }

    getCounts(set) {
        return set.filter(s => s !== '.').length
    }

    createMap() {
        return Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }

    getAnswerMap() {
        var answerMap = this.displayShips();
        return answerMap.map(row => row.map(col => col === 0 ? '.' : col))
    }

    getQuestionMap() {
        var questionMap = Array(this.rows).fill().map(() => Array(this.cols).fill('.'))
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.answerMap[r][c] === ".") {
                    if (Math.random() < this.difficulty/10) {
                        questionMap[r][c] = '0'
                    }
                    
                }
                else {
                    if (Math.random() < this.difficulty) {
                        questionMap[r][c] =  this.answerMap[r][c]
                    }
                }
            }
        }
        return questionMap;
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

class FileFactory {
    createFiles(rows, columns, shipsToPlace, difficulty, numberOfFiles){
        for (let f = 0; f < numberOfFiles; f++) {
    
        const fileName = `${difficulty}_${f}.json`;
        let grid = new Grid(rows, columns, shipsToPlace, difficulty);
    
        fs.writeFile(fileName, JSON.stringify(grid), (err) => { if (err) throw err; });
        }
    };
}

const rows = 10;
const columns = 10;
const shipsToPlace = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

fileFactory = new FileFactory();
fileFactory.createFiles(rows, columns, shipsToPlace, 0.1, 10)
fileFactory.createFiles(rows, columns, shipsToPlace, 0.2, 10)
fileFactory.createFiles(rows, columns, shipsToPlace, 0.3, 10)
fileFactory.createFiles(rows, columns, shipsToPlace, 0.4, 10)