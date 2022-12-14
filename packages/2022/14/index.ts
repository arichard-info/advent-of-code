const { EOL } = require('os');

const parseData = (data: string): { rocks: Set<string>; deepest: number } => {
    const rocks = new Set<string>();
    let deepest = 0;
    data.split(EOL).forEach((row) => {
        const points = row.split(' -> ');
        for (let i = 1; i < points.length; i++) {
            const [x1, y1] = points[i - 1].split(',');
            const [x2, y2] = points[i].split(',');
            if (+y1 > deepest) deepest = +y1;
            if (+y2 > deepest) deepest = +y2;
            const sortedX = [+x1, +x2].sort((a, b) => a - b);
            const sortedY = [+y1, +y2].sort((a, b) => a - b);
            for (let x = sortedX[0]; x <= sortedX[1]; x++) rocks.add([x, +y1].toString());
            for (let y = sortedY[0]; y <= sortedY[1]; y++) rocks.add([+x1, y].toString());
        }
    });
    return { rocks, deepest };
};

const startSimulation1 = (rocks: Set<string>, deepest: number): number => {
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
    return sandCount;
};

const startSimulation2 = (rocks: Set<string>, deepest: number): number => {
    const occupied = new Set(rocks);
    let s = [500, 0];
    let sandCount = 0;
    while (true) {
        if (s[1] === deepest + 1) {
            sandCount++;
            occupied.add(s.toString());
            s = [500, 0];
        } else if (!occupied.has([s[0], s[1] + 1].toString())) s = [s[0], s[1] + 1];
        else if (!occupied.has([s[0] - 1, s[1] + 1].toString())) s = [s[0] - 1, s[1] + 1];
        else if (!occupied.has([s[0] + 1, s[1] + 1].toString())) s = [s[0] + 1, s[1] + 1];
        else if (s[0] === 500 && s[1] === 0) return sandCount + 1;
        else {
            sandCount++;
            occupied.add(s.toString());
            s = [500, 0];
        }
    }
};

module.exports = (rawData: string) => {
    const { rocks, deepest } = parseData(rawData);
    console.log('1.', startSimulation1(rocks, deepest));
    console.log('2.', startSimulation2(rocks, deepest));
};

export {};
