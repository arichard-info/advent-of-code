const { EOL } = require('os');

type Instruction = number | 'R' | 'L';
type Cell = '' | '.' | '#';
type Map = Cell[][];
type Position = { x: number; y: number };

const parseData = (data: string): { map: Map; instructions: Instruction[] } => {
    const [rawMap, rawInstructions] = data.split(EOL + EOL);
    const instructions = rawInstructions.match(/(\d+)|R|L/gm)?.map((i) => {
        if (Number.isInteger(+i)) return +i;
        return i;
    }) as Instruction[];
    const map = rawMap.split(EOL).map((row) => row.split('').map((el) => el.trim())) as Map;
    return { map, instructions };
};

const part1 = (map: Map, instructions: Instruction[]) => {
    const startY = 0;
    const startX = map[startY].findIndex((e) => e === '.');
    const pos: Position = { x: startX, y: startY };

    instructions.forEach((instruction) => {
        if (typeof instruction === 'number') {
        }

        if (instruction === 'R') {
        }

        if (instruction === 'L') {
        }
    });
};

module.exports = (rawData: string) => {
    const { map, instructions } = parseData(rawData);
    console.log('1.', part1(map, instructions));

    console.log('2.');
};

export {};
