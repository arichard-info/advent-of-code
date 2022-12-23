const { EOL } = require('os');

type Instruction = number | 'R' | 'L';
type Cell = '' | '.' | '#';
type Map = Cell[][];
type Position = { x: number; y: number };

const deltas = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
];

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
    let pos: Position = { x: startX, y: startY };
    let deltaIndex = 0;
    let delta = deltas[deltaIndex];

    instructions.forEach((instruction) => {
        if (typeof instruction === 'number') {
            for (let i = 0; i < instruction; i++) {
                let next = { x: pos.x + delta.x, y: pos.y + delta.y };
                if (!map[next.y]?.[next.x]) {
                    let newPos = pos;
                    let prev = { x: pos.x - delta.x, y: pos.y - delta.y };
                    while (map[prev.y]?.[prev.x]) {
                        newPos = prev;
                        prev.x -= delta.x;
                        prev.y -= delta.y;
                    }
                    next = { x: newPos.x + delta.x, y: newPos.y + delta.y };
                }
                if (map[next.y][next.x] === '#') break;
                else if (map[next.y][next.x] === '.') pos = next;
            }
        }

        if (instruction === 'R') {
            deltaIndex = deltaIndex + 1 < deltas.length ? deltaIndex + 1 : 0;
            delta = deltas[deltaIndex];
        }
        if (instruction === 'L') {
            deltaIndex = deltaIndex - 1 > -1 ? deltaIndex - 1 : deltas.length - 1;
            delta = deltas[deltaIndex];
        }
    });

    return (pos.x + 1) * 4 + (pos.y + 1) * 1000 + deltaIndex;
};

const part2 = (data: string) => {
    type pt = [number, number];
    type turn = 'L' | 'R';
    type step = number | turn;
    type face = 'U' | 'D' | 'L' | 'R';
    type state = { pos: pt; facing: face };

    const [s1, s2] = data.split(EOL + EOL);
    const M: Record<string, string> = {};
    let start: pt;
    s1.split('\n').forEach((l, y) =>
        l.split('').forEach((c, x) => {
            if (c !== ' ') {
                M[`${x},${y}`] = c;
                if (!start) start = [x, y];
            }
        })
    );
    const steps: step[] = s2.match(/(\d+|[LR])/g)!.map((s) => (/[LR]/.test(s) ? (s as turn) : +s));

    const DIRS: Record<face, pt> = {
        U: [0, -1],
        D: [0, 1],
        L: [-1, 0],
        R: [1, 0],
    };
    const TURNS: Record<face, Record<turn, face>> = {
        U: { L: 'L', R: 'R' },
        R: { L: 'U', R: 'D' },
        D: { L: 'R', R: 'L' },
        L: { L: 'D', R: 'U' },
    };

    const nextPos = ({ pos, facing }: state) => {
        const next = pos.map((n, i) => n + DIRS[facing][i]) as pt;
        if (M[next + ''] !== undefined) return { pos: next, facing };
        const code = getRegion(pos)! + facing;
        const [x, y] = pos;
        let result;
        if (code === '1U') result = [[0, x + 100], 'R'];
        if (code === '1L') result = [[0, 149 - y], 'R'];
        if (code === '2U') result = [[x - 100, 199], 'U'];
        if (code === '2R') result = [[99, 149 - y], 'L'];
        if (code === '2D') result = [[99, x - 50], 'L'];
        if (code === '3L') result = [[y - 50, 100], 'D'];
        if (code === '3R') result = [[y + 50, 49], 'U'];
        if (code === '5R') result = [[149, 149 - y], 'L'];
        if (code === '5D') result = [[49, x + 100], 'L'];
        if (code === '4U') result = [[50, x + 50], 'R'];
        if (code === '4L') result = [[50, 149 - y], 'R'];
        if (code === '6L') result = [[y - 100, 0], 'D'];
        if (code === '6D') result = [[x + 100, 0], 'D'];
        if (code === '6R') result = [[y - 100, 149], 'U'];
        if (!result) throw new Error('invalid state');
        return { pos: result[0], facing: result[1] } as state;
    };

    const walk = () => {
        let facing: face = 'R';
        let pos: pt = [...start!];
        steps.forEach((s) => {
            if (Number.isInteger(s)) {
                for (let i = 0; i < s; i++) {
                    const { pos: next, facing: _facing } = nextPos({ pos, facing });
                    facing = _facing;
                    if (M[next + ''] === '#') break;
                    pos = next;
                }
            } else {
                console.log('Yo');
                facing = TURNS[facing][s as turn];
            }
        });
        return { pos, facing };
    };

    const getRegion = ([x, y]: pt) => {
        if (x >= 50 && x <= 99 && y >= 0 && y <= 49) return 1;
        if (x >= 100 && x <= 149 && y >= 0 && y <= 49) return 2;
        if (x >= 50 && x <= 99 && y >= 50 && y <= 99) return 3;
        if (x >= 50 && x <= 99 && y >= 100 && y <= 149) return 5;
        if (x >= 0 && x <= 49 && y >= 100 && y <= 149) return 4;
        if (x >= 0 && x <= 49 && y >= 150 && y <= 199) return 6;
        return undefined;
    };

    const facingValues: Record<string, number> = { U: 3, R: 0, L: 2, D: 1 };
    const {
        pos: [x, y],
        facing,
    } = walk();
    return 1000 * (y + 1) + 4 * (x + 1) + facingValues[facing];
};

module.exports = (rawData: string) => {
    const { map, instructions } = parseData(rawData);
    console.log('1.', part1(map, instructions));

    console.log('2.', part2(rawData));
};

export {};
