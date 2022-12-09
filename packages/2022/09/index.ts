const { EOL } = require('os');

interface Instruction {
    direction: 'R' | 'L' | 'U' | 'D';
    value: number;
}

const parseData = (data: string): Instruction[] =>
    data.split(EOL).map(
        (line: string): Instruction => ({
            direction: line.split(' ')[0] as Instruction['direction'],
            value: +line.split(' ')[1],
        })
    );

const countPositions = (instructions: Instruction[]): number => {
    let head = [0, 0];
    let tail = [0, 0];
    let tailPositions = new Set<string>();
    instructions.forEach((instruction) => {
        for (let i = 0; i < instruction.value; i++) {
            switch (instruction.direction) {
                case 'D':
                    head[0] -= 1;
                    break;
                case 'U':
                    head[0] += 1;
                    break;
                case 'L':
                    head[1] -= 1;
                    break;
                case 'R':
                    head[1] += 1;
                    break;
            }

            if (tail[0] === head[0] - 2) tail = [head[0] - 1, head[1]];
            if (tail[0] === head[0] + 2) tail = [head[0] + 1, head[1]];
            if (tail[1] === head[1] - 2) tail = [head[0], head[1] - 1];
            if (tail[1] === head[1] + 2) tail = [head[0], head[1] + 1];

            tailPositions.add(`${tail[0]}-${tail[1]}`);
        }
    });

    return tailPositions.size;
};

const moveTail = (head: number[], tail: number[]) => {
    const delta = [head[0] - tail[0], head[1] - tail[1]];
    if (Math.abs(delta[0]) < 2 && Math.abs(delta[1]) < 2) {
        return;
    } else {
        tail[0] += Math.sign(delta[0]);
        tail[1] += Math.sign(delta[1]);
    }
};

const countLongPositions = (instructions: Instruction[]): number => {
    const knots = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
    ];
    let tailPositions = new Set<string>();
    instructions.forEach((instruction: Instruction) => {
        let step;
        let axis;

        switch (instruction.direction) {
            case 'D':
                axis = 1;
                step = -1;
                break;
            case 'U':
                axis = 1;
                step = 1;
                break;
            case 'L':
                axis = 0;
                step = -1;
                break;
            case 'R':
                axis = 0;
                step = 1;
                break;
        }

        const goal = knots[0][axis] + Number(instruction.value) * step;
        while (knots[0][axis] !== goal) {
            knots[0][axis] += step;
            for (let i = 1; i < knots.length; i++) {
                moveTail(knots[i - 1], knots[i]);
            }
            tailPositions.add(`${knots.at(-1)}`);
        }
    });
    return tailPositions.size;
};

module.exports = (rawData: string) => {
    const instructions = parseData(rawData);
    console.log('1.', countPositions(instructions));
    console.log('2.', countLongPositions(instructions));
};

export {};
