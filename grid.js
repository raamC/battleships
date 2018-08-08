const Ship = require('./ship');

class Grid {
  constructor(rows, cols, shipsToPlace) {
    this.rows = rows;
    this.cols = cols;
    this.shipsToPlace = shipsToPlace;
    this.map = this.createMap();
    this.placedShips = this.getPlacedShips();
    this.placedMap = this.displayShips();
  }

  // getDisplayMap() {

  // }

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
        if (s.isHorizontal) {
          map[s.topLeftPosition.row][s.topLeftPosition.col + i] = s.length;
        } else {
          map[s.topLeftPosition.row + i][s.topLeftPosition.col] = s.length;
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

module.exports = Grid;