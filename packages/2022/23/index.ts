const { EOL } = require('os');

type Position = [number, number];

const parseData = (data: string): string[][] => data.split(EOL).map((row) => row.split(''));

const deltasArray = [
    [
        [-1, -1],
        [0, -1],
        [1, -1],
    ],
    [
        [-1, 1],
        [0, 1],
        [1, 1],
    ],
    [
        [-1, -1],
        [-1, 0],
        [-1, 1],
    ],
    [
        [1, -1],
        [1, 0],
        [1, 1],
    ],
];

const getElvesSet = (data: string[][]): Set<string> => {
    let elves = new Set<string>();
    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            if (data[y][x] === '#') elves.add([x, y].toString());
        }
    }
    return elves;
};

const getBoundings = (elves: Set<string>): { minX: number; maxX: number; minY: number; maxY: number } => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    elves.forEach((elve) => {
        const [x, y] = elve.split(',');
        if (+x < minX) minX = +x;
        if (+x > maxX) maxX = +x;
        if (+y < minY) minY = +y;
        if (+y > maxY) maxY = +y;
    });

    return { minX, maxX, minY, maxY };
};

const drawElves = (elves: Set<string>) => {
    const { minX, maxX, minY, maxY } = getBoundings(elves);
    let str = '';
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            if (!elves.has([x, y].toString())) str += '.';
            else str += '#';
        }
        str += EOL;
    }
    console.log(str);
};

const part1 = (data: string[][], rounds: number): number => {
    let elves = getElvesSet(data);
    for (let i = 0; i < rounds; i++) {
        const propositions = {} as { [key: string]: Position[] };
        const firstDeltaIndex = i % deltasArray.length;

        elves.forEach((elve) => {
            const elvePos = elve.split(',').map(Number) as Position;

            let newPos;
            let emptyAround = true;
            for (let b = 0; b < deltasArray.length; b++) {
                const deltas = deltasArray[(b + firstDeltaIndex) % deltasArray.length];
                if (deltas.some((d) => elves.has([elvePos[0] + d[0], elvePos[1] + d[1]].toString()))) {
                    emptyAround = false;
                } else if (!newPos) {
                    newPos = [elvePos[0] + deltas[1][0], elvePos[1] + deltas[1][1]];
                }
            }

            if (!emptyAround && newPos) {
                if (!propositions[newPos.toString()]) propositions[newPos.toString()] = [];
                propositions[newPos.toString()].push(elvePos);
            }
        });

        Object.entries(propositions).forEach(([destination, origins]) => {
            if (origins.length > 1) return;
            elves.delete(origins[0].toString());
            elves.add(destination);
        });
    }

    const { minX, maxX, minY, maxY } = getBoundings(elves);
    let count = 0;
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            if (!elves.has([x, y].toString())) count++;
        }
    }
    return count;
};

const part2 = (data: string[][]): number => {
    let elves = getElvesSet(data);
    let i = 0;
    while (true) {
        const propositions = {} as { [key: string]: Position[] };
        const firstDeltaIndex = i % deltasArray.length;

        elves.forEach((elve) => {
            const elvePos = elve.split(',').map(Number) as Position;

            let newPos;
            let emptyAround = true;
            for (let b = 0; b < deltasArray.length; b++) {
                const deltas = deltasArray[(b + firstDeltaIndex) % deltasArray.length];
                if (deltas.some((d) => elves.has([elvePos[0] + d[0], elvePos[1] + d[1]].toString()))) {
                    emptyAround = false;
                } else if (!newPos) {
                    newPos = [elvePos[0] + deltas[1][0], elvePos[1] + deltas[1][1]];
                }
            }

            if (!emptyAround && newPos) {
                if (!propositions[newPos.toString()]) propositions[newPos.toString()] = [];
                propositions[newPos.toString()].push(elvePos);
            }
        });

        if (Object.keys(propositions).length === 0) return i + 1;

        Object.entries(propositions).forEach(([destination, origins]) => {
            if (origins.length > 1) return;
            elves.delete(origins[0].toString());
            elves.add(destination);
        });

        i++;
    }
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    console.log('1.', part1(data, 30));

    console.log('2.', part2(data));
};

export {};
