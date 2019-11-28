class Canvas {
    constructor(grid, styleParams, ) {
        this.grid = grid;
        this.styleParams = styleParams;
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
                index * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing))

        colCounts.map((cc, index) =>
            this.drawCount(cc,
                index * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing,
                this.grid.rows * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing
            ))
    }

    drawBlocks(rows, columns) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                const x = c * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing;
                const y = r * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing;
                if (this.grid.questionMap[r][c] !== ".") {
                        this.drawBlock(this.grid.questionMap[r][c], x, y)
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
                    rows * (this.styleParams.spacing + this.styleParams.blockSize))
                this.drawLine(
                    this.styleParams.spacing / 2 + 1,
                    r * (this.styleParams.spacing + this.styleParams.blockSize) + this.styleParams.spacing,
                    columns * (this.styleParams.spacing + this.styleParams.blockSize),
                    0)
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
            case '0':
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

export {Canvas};
