class Ship {
  constructor(length) {
    this.length = length;
    this.isHorizontal = this.getOrientation();
    this.topLeftPosition = {row: 0, col: 0};
  }
  // Getter
  // get area() {
  //   return this.calcArea();
  // }

  // Method
  getOrientation() {
    return (Math.round(Math.random())) === 1 ? true : false;
  }
}

module.exports = Ship;