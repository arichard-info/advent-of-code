const parseData = (data: string): string[] => data.split('');

type Position = [number, number];

interface Rock {
    points: Position[];
    bottom: number;
    right: number;
    id: string;
}

interface State {
    rock: string;
    jet: number;
    pattern?: string;
    index: number;
    higher: number;
}

const rocks: Rock[] = [
    {
        id: '-',
        points: [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
        ],
        bottom: 0,
        right: 3,
    },
    {
        id: '+',
        points: [
            [1, 0],
            [0, -1],
            [1, -1],
            [2, -1],
            [1, -2],
        ],
        bottom: 2,
        right: 2,
    },
    {
        id: '∟',
        points: [
            [2, 0],
            [2, -1],
            [2, -2],
            [1, -2],
            [0, -2],
        ],
        bottom: 2,
        right: 2,
    },
    {
        id: '|',
        points: [
            [0, 0],
            [0, -1],
            [0, -2],
            [0, -3],
        ],
        bottom: 3,
        right: 0,
    },
    {
        id: '□',
        points: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        bottom: 1,
        right: 1,
    },
];

const isOnGround = (rock: Rock, position: Position): boolean => {
    return position[1] - rock.bottom <= 0;
};

const getOccupiedPoints = (rock: Rock, topLeftPosition: Position): Position[] => {
    return rock.points.map((point) => [point[0] + topLeftPosition[0], point[1] + topLeftPosition[1]]);
};

const rockCollision = (pos: Position, rock: Rock, occupied: Set<string>): boolean => {
    return rock.points.some((point) => occupied.has([pos[0] + point[0], pos[1] + point[1]].toString()));
};

const simulation1 = (jetPattern: string[], rounds: number): number => {
    const occupied = new Set<string>();
    let higher = 0;
    let patternIndex = -1;

    for (let i = 0; i < rounds; i++) {
        const rock = rocks[i % rocks.length];
        let topLeftPosition: Position = [2, higher + rock.bottom + 3];

        while (true) {
            patternIndex = jetPattern[patternIndex + 1] ? patternIndex + 1 : 0;
            const pattern = jetPattern[patternIndex];

            // Move Right
            if (
                pattern === '>' &&
                topLeftPosition[0] + rock.right < 6 &&
                !rockCollision([topLeftPosition[0] + 1, topLeftPosition[1]], rock, occupied)
            ) {
                topLeftPosition[0]++;
            }

            // Move left
            if (
                pattern === '<' &&
                topLeftPosition[0] > 0 &&
                !rockCollision([topLeftPosition[0] - 1, topLeftPosition[1]], rock, occupied)
            ) {
                topLeftPosition[0]--;
            }

            // On Rock
            if (rockCollision([topLeftPosition[0], topLeftPosition[1] - 1], rock, occupied)) break;

            // On ground
            if (isOnGround(rock, topLeftPosition)) break;

            topLeftPosition[1]--;
        }
        if (topLeftPosition[1] + 1 > higher) higher = topLeftPosition[1] + 1;
        const occupiedPoints = getOccupiedPoints(rock, topLeftPosition);
        occupiedPoints.forEach((p) => occupied.add(p.toString()));
    }
    return higher;
};

const simulation2 = (jetPattern: string[], rounds: number): number => {
    const occupied = new Set<string>();
    let patternIndex = -1;
    let higher = 0;

    const addRock = (rock: Rock) => {
        let pos: Position = [2, higher + rock.bottom + 3];

        while (true) {
            patternIndex = (patternIndex + 1) % jetPattern.length;
            const pattern = jetPattern[patternIndex];

            if (
                pattern === '>' &&
                pos[0] + rock.right < 6 &&
                !rockCollision([pos[0] + 1, pos[1]], rock, occupied)
            ) {
                pos[0]++;
            }

            if (pattern === '<' && pos[0] > 0 && !rockCollision([pos[0] - 1, pos[1]], rock, occupied)) {
                pos[0]--;
            }

            if (rockCollision([pos[0], pos[1] - 1], rock, occupied) || isOnGround(rock, pos)) break;
            pos[1]--;
        }

        const occupiedPoints = getOccupiedPoints(rock, pos);
        occupiedPoints.forEach((p) => occupied.add(p.toString()));
        higher = pos[1] + 1 > higher ? pos[1] + 1 : higher;
    };

    const getPattern = (): string | undefined => {
        const covered = [0, 0, 0, 0, 0, 0, 0];
        const pattern: string[][] = [];
        let row = 0;
        while (true) {
            pattern[row] = [];
            for (let i = 0; i < 7; i++) {
                if (occupied.has([i, higher - row].toString())) {
                    covered[i] = 1;
                    pattern[row][i] = '#';
                } else pattern[row][i] = '.';
            }
            if (row === higher) return undefined;
            if (covered.every((e) => e === 1)) return pattern.map((row) => row.join('')).join('');
            row++;
        }
    };

    let i = 0;
    let state!: State;
    const states: State[] = [];

    while (true) {
        const rock = rocks[i % rocks.length];
        addRock(rock);
        const currentState: State = {
            rock: rock.id,
            jet: patternIndex,
            pattern: getPattern(),
            index: i,
            higher,
        };
        const firstCycle = states.find(
            (s) =>
                s.rock === currentState.rock &&
                s.jet === currentState.jet &&
                s.pattern === currentState.pattern
        );
        if (firstCycle && currentState.pattern) {
            state = firstCycle;
            break;
        }
        states.push(currentState);
        i++;
    }

    const cycleHeight = higher - state.higher;
    const cycleLength = i - state.index;
    const remaining = (rounds - state.index) % cycleLength;

    for (let y = i + 1; y < i + remaining; y++) {
        const rock = rocks[y % rocks.length];
        addRock(rock);
    }

    const cycles = (rounds - (state.index + remaining)) / cycleLength;
    return cycleHeight * (cycles - 1) + higher;
};

module.exports = (rawData: string) => {
    const jetPattern = parseData(rawData);
    console.log('1.', simulation1(jetPattern, 2022));
    console.log('2.', simulation2(jetPattern, 1000000000000));
};

export {};
