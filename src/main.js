import {Grid} from'./Grid.js';

const rows = 10;
const columns = 10;
const difficulty = 0.25; // percentage of blocks shown

const shipsToPlace =
    [ 4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
let grid = new Grid(rows, columns, shipsToPlace);

console.log(grid.placedMap)


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

document.getElementById("button").addEventListener("click", clickTest);

function clickTest() {
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

