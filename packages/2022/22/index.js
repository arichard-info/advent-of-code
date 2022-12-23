const fs = require('fs');
const { EOL } = require('os');

const data = fs.readFileSync(`data.txt`, { encoding: 'utf8' });

const [rawBoard, directions] = data.split(EOL + EOL);

const directionsParsed = directions.match(/\d+|(L|R)/g);

const parsedBoard = rawBoard.split(EOL).map((row) => row.split(''));

let currentRow = 0;
let currentCol = 0;
let currentDirection = 'R';

let currentRowCursor = 0;
let currentColCursor = 0;
let currentDirectionCursor = 'R';

function findStartingPosition() {
    currentRow = 0;
    currentCol = 0;
    while (parsedBoard[currentRow][currentCol] != '.') {
        currentCol++;
    }
    currentRowCursor = currentRow;
    currentColCursor = currentCol;
}

function moveCursorToNextNonEmptyPositionInCube() {
    currentDirectionCursor = currentDirection;

    do {
        moveCursorToNextPositionInCube();
    } while (parsedBoard[currentRowCursor][currentColCursor] == ' ');
}

function moveCursorToNextPositionInCube() {
    let finalRow = currentRowCursor;
    let finalCol = currentColCursor;
    let finalDir = currentDirectionCursor;

    let row = currentRowCursor;
    let col = currentColCursor;

    if (0 <= row && row <= 49 && 50 <= col && col <= 99) {
        /*
            Face1
            0-49
            50-99
                row 0, col 50-99 -> up -> Face 6, row 150-199 col 0
                row 0-49, col 50 -> left -> Face 5, row 149-100 col 0
        */
        if (currentDirectionCursor == 'T' && row == 0) {
            finalRow = 150 + (col - 50);
            finalCol = 0;
            finalDir = 'R';
        } else if (currentDirectionCursor == 'L' && col == 50) {
            finalRow = 149 - (row - 0);
            finalCol = 0;
            finalDir = 'R';
        }
    } else if (0 <= row && row <= 49 && 100 <= col && col <= 149) {
        /*
            Face2
            0-49
            100-149
                row 0-49, col 100 -> top -> Face 6, row 199, col 0-49
                row 0-49, col 149 -> right -> Face 4, row 149-100, col99
                row 49, col 100-149 -> down -> Face 3, row 50-99, col99
        */
        if (currentDirectionCursor == 'T' && row == 0) {
            finalRow = 199;
            finalCol = 0 + (col - 100);
            finalDir = 'T';
        } else if (currentDirectionCursor == 'R' && col == 149) {
            finalRow = 149 - (row - 0);
            finalCol = 99;
            finalDir = 'L';
        } else if (currentDirectionCursor == 'D' && row == 49) {
            finalRow = 50 + (col - 100);
            finalCol = 99;
            finalDir = 'L';
        }
    } else if (50 <= row && row <= 99 && 50 <= col && col <= 99) {
        /*
            VER
            Face3
            50-99
            50-99
                row 50-99, col 50 -> left -> Face 5, row 100, col 0-49
                row 50-99, col 99 -> right -> Face 2, row 49, col 100-149
        */
        if (currentDirectionCursor == 'L' && col == 50) {
            finalRow = 100;
            finalCol = 0 + (row - 50);
            finalDir = 'D';
        } else if (currentDirectionCursor == 'R' && col == 99) {
            finalRow = 49;
            finalCol = 100 + (row - 50);
            finalDir = 'T';
        }
    } else if (100 <= row && row <= 149 && 50 <= col && col <= 99) {
        /*
            Face4
            100-149
            50-99
                row 100-149, col99 -> right -> Face 2, row 49-0, col 149
                row 149, col50-99 -> down -> Face 6, row 150-199, col 49
        */
        if (currentDirectionCursor == 'R' && col == 99) {
            finalRow = 49 - (row - 100);
            finalCol = 149;
            finalDir = 'L';
        } else if (currentDirectionCursor == 'D' && row == 149) {
            finalRow = 150 + (col - 50);
            finalCol = 49;
            finalDir = 'L';
        }
    } else if (100 <= row && row <= 149 && 0 <= col && col <= 49) {
        /*
            Face5
            100-149
            0-49
                row 100-149 col 0 -> left -> Face 1 row 49-0, col 50
                row 100, col 0-49 -> up -> Face 3 row 50-99, col 50
        */
        if (currentDirectionCursor == 'L' && col == 0) {
            finalRow = 49 - (row - 100);
            finalCol = 50;
            finalDir = 'R';
        } else if (currentDirectionCursor == 'T' && row == 100) {
            finalRow = 50 + (col - 0);
            finalCol = 50;
            finalDir = 'R';
        }
    } else if (150 <= row && row <= 199 && 0 <= col && col <= 49) {
        /*
            Face6
            150-199
            0-49
                row 150-199 col 0 -> left -> Face 1, row 0, col 50-99
                row 199, col 0-49 -> down -> Face2, row 0-49, col 100
                row 150-199, col 49 -> right -> Face 4, row 149, col 50-99 
        */
        if (currentDirectionCursor == 'L' && col == 0) {
            finalRow = 0;
            finalCol = 50 + (row - 150);
            finalDir = 'D';
        } else if (currentDirectionCursor == 'D' && row == 199) {
            finalRow = 0;
            finalCol = 100 + (col - 0);
            finalDir = 'D';
        } else if (currentDirectionCursor == 'R' && col == 49) {
            finalRow = 149;
            finalCol = 50 + (row - 150);
            finalDir = 'T';
        }
    }

    if (row === finalRow && col === finalCol) {
        switch (currentDirectionCursor) {
            case 'T':
                currentRowCursor--;
                break;
            case 'R':
                currentColCursor++;
                break;
            case 'D':
                currentRowCursor++;
                break;
            case 'L':
                currentColCursor--;
                break;
        }
    } else {
        currentRowCursor = finalRow;
        currentColCursor = finalCol;
        currentDirectionCursor = finalDir;
    }
}

function solve() {
    findStartingPosition();
    for (let direction of directionsParsed) {
        if (direction == 'L') {
            switch (currentDirection) {
                case 'T':
                    currentDirection = 'L';
                    break;
                case 'R':
                    currentDirection = 'T';
                    break;
                case 'D':
                    currentDirection = 'R';
                    break;
                case 'L':
                    currentDirection = 'D';
                    break;
            }
        } else if (direction == 'R') {
            switch (currentDirection) {
                case 'T':
                    currentDirection = 'R';
                    break;
                case 'R':
                    currentDirection = 'D';
                    break;
                case 'D':
                    currentDirection = 'L';
                    break;
                case 'L':
                    currentDirection = 'T';
                    break;
            }
        } else {
            let steps = +direction;
            while (steps > 0) {
                moveCursorToNextNonEmptyPositionInCube();

                if (parsedBoard[currentRowCursor][currentColCursor] == '#') {
                    currentRowCursor = currentRow;
                    currentColCursor = currentCol;
                    currentDirectionCursor = currentDirection;
                    break;
                } else {
                    currentRow = currentRowCursor;
                    currentCol = currentColCursor;
                    currentDirection = currentDirectionCursor;

                    steps--;
                }
            }
        }
    }

    const directionsValues = { R: 0, D: 1, L: 2, T: 3 };
    return 1000 * (currentRow + 1) + 4 * (currentCol + 1) + directionsValues[currentDirection];
}

console.log(solve());
