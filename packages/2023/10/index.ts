const { EOL } = require('os');
const nodePath = require('path');
const fs = require('fs');

const { createCanvas } = require('canvas');

const parseData = (data: string): string[][] => data.split(EOL).map((r) => r.split(''));

const pipes: { [key: string]: { top: number; right: number; bottom: number; left: number } } = {
    '-': { top: 0, right: 1, bottom: 0, left: 1 },
    '|': { top: 1, right: 0, bottom: 1, left: 0 },
    L: { top: 1, right: 1, bottom: 0, left: 0 },
    J: { top: 1, right: 0, bottom: 0, left: 1 },
    '7': { top: 0, right: 0, bottom: 1, left: 1 },
    F: { top: 0, right: 1, bottom: 1, left: 0 },
    S: { top: 1, right: 1, bottom: 1, left: 1 },
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    const width = data[0].length * 3;
    const height = data.length * 3;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    let pos: { x: number; y: number } = { x: -1, y: -1 };
    posloop: for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[0].length; x++) {
            if (data[y][x] === 'S') {
                pos = { x, y };
                break posloop;
            }
        }
    }

    const path = [{ pos, character: 'S' }];

    let safeIndex = 0;

    while (safeIndex < 100000) {
        pipeloop: for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if ((x !== 0 && y !== 0) || (x === 0 && y === 0)) continue;

                const segment = path[path.length - 1];
                const previousSegment = path[path.length - 2];
                const testPos = { x: segment.pos.x + x, y: segment.pos.y + y };

                if (testPos.x === segment.pos.x && testPos.y === segment.pos.y) {
                    continue;
                }

                if (
                    previousSegment &&
                    testPos.x === previousSegment.pos.x &&
                    testPos.y === previousSegment.pos.y
                ) {
                    continue;
                }

                const character = data[testPos.y]?.[testPos.x];
                const pipe = pipes[character];

                if (!pipe) continue;

                const currentPipe = pipes[segment.character];
                if (
                    (y === 1 && currentPipe.bottom && pipe.top) ||
                    (y === -1 && currentPipe.top && pipe.bottom) ||
                    (x === 1 && currentPipe.right && pipe.left) ||
                    (x === -1 && currentPipe.left && pipe.right)
                ) {
                    path.push({ pos: testPos, character });
                    const centerPosition = { x: testPos.x * 3 + 1, y: testPos.y * 3 + 1 };

                    ctx.fillStyle = '#99b6c9';
                    //ctx.fillRect(testPos.x * 3, testPos.y * 3, 3, 3);

                    ctx.fillStyle = '#000000';

                    ctx.fillRect(centerPosition.x, centerPosition.y, 1, 1);
                    if (pipe.bottom) ctx.fillRect(centerPosition.x, centerPosition.y + 1, 1, 1);
                    if (pipe.top) ctx.fillRect(centerPosition.x, centerPosition.y - 1, 1, 1);
                    if (pipe.left) ctx.fillRect(centerPosition.x - 1, centerPosition.y, 1, 1);
                    if (pipe.right) ctx.fillRect(centerPosition.x + 1, centerPosition.y, 1, 1);
                    break pipeloop;
                }
            }
        }

        if (path[path.length - 1].character === 'S') {
            break;
        }
        safeIndex++;
    }

    console.log('1.', Math.floor((path.length - 1) / 2));

    const stream = canvas.createPNGStream();
    const out = fs.createWriteStream(nodePath.join(__dirname, 'image.png'));
    stream.pipe(out);

    console.log('2.', 'image.png');
};

export {};
