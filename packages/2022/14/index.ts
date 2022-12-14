const { EOL } = require('os');

const parseData = (
    data: string
): { rocks: Set<string>; deepest: number; minX: number; maxX: number } => {
    const rocks = new Set<string>();
    let deepest = 0;
    let minX = Infinity;
    let maxX = 0;
    data.split(EOL).forEach((row) => {
        const points = row.split(' -> ');
        for (let i = 1; i < points.length; i++) {
            const [x1, y1] = points[i - 1].split(',');
            const [x2, y2] = points[i].split(',');
            if (+y1 > deepest) deepest = +y1;
            if (+y2 > deepest) deepest = +y2;
            const sortedX = [+x1, +x2].sort();
            if (sortedX[0] < minX) minX = sortedX[0];
            if (sortedX[1] > maxX) maxX = sortedX[1];
            if (x1 !== x2) {
                for (let x = sortedX[0]; x <= sortedX[1]; x++) rocks.add([x, y1].toString());
            } else if (y1 !== y2) {
                const sorted = [+y1, +y2].sort();
                for (let y = sorted[0]; y <= sorted[1]; y++) rocks.add([x1, y].toString());
            }
        }
    });
    return { rocks, deepest, minX, maxX };
};

const startSimulation = (
    rocks: Set<string>,
    deepest: number,
    minX: number,
    maxX: number
): number => {
    const occupied = new Set(rocks);
    const sand = new Set<string>();
    let s = [500, 0];
    let sandCount = 0;
    while (s[1] < deepest) {
        if (!occupied.has([s[0], s[1] + 1].toString())) s = [s[0], s[1] + 1];
        else if (!occupied.has([s[0] - 1, s[1] + 1].toString())) s = [s[0] - 1, s[1] + 1];
        else if (!occupied.has([s[0] + 1, s[1] + 1].toString())) s = [s[0] + 1, s[1] + 1];
        else {
            sandCount++;
            occupied.add(s.toString());
            sand.add(s.toString());
            s = [500, 0];
        }
    }
    drawSimulation(rocks, sand, deepest, minX, maxX);
    return sandCount;
};

const drawSimulation = (
    rocks: Set<string>,
    sand: Set<string>,
    deepest: number,
    minX: number,
    maxX: number
) => {
    const arr = Array.from({ length: deepest + 1 }, () =>
        Array.from({ length: maxX - minX + 1 }, () => '.')
    );

    rocks.forEach((rock) => {
        const [x, y] = rock.split(',');
        arr[+y][+x - minX] = '#';
    });

    sand.forEach((sand) => {
        const [x, y] = sand.split(',');
        arr[+y][+x - minX] = 'o';
    });

    console.log(arr.map((row) => row.join('')).join(EOL));
};

module.exports = (rawData: string) => {
    const { rocks, deepest, minX, maxX } = parseData(rawData);

    console.log('--');
    console.log('1.', startSimulation(rocks, deepest, minX, maxX));

    console.log('2.');
};

export {};
