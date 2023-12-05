const { EOL } = require('os');

type Game = {
    id: string;
    winning: number[];
    played: number[];
    count: number;
};

const parseData = (data: string): Game[] =>
    data.split(EOL).map((row) => {
        const parseNumbers = (numbers: string): number[] => numbers.split(' ').map((n) => +n);

        const [rawGameId, rawNumbers] = row.split(': ');
        const [winning, played] = rawNumbers.split(' | ');

        return {
            id: rawGameId.split(' ')[1],
            winning: parseNumbers(winning),
            played: parseNumbers(played),
            count: 1,
        };
    });

const calculateScore = (count: number): number => {
    if (!count) return 0;
    let value = 1;
    for (let i = 0; i < count - 1; i++) {
        value = value * 2;
    }
    return value;
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    let res1 = 0;
    data.forEach((game) => {
        let count = 0;
        game.played.forEach((number) => {
            if (game.winning.find((n) => n === number)) count++;
        });
        res1 += calculateScore(count);
    });

    console.log('1.', res1);

    for (let i = 0; i < data.length; i++) {
        const game = data[i];
        let count = 0;
        game.played.forEach((number) => {
            if (game.winning.find((n) => n === number)) count++;
        });
        if (count) {
            for (let y = 0; y < game.count; y++) {
                for (let c = i + 1; c < i + 1 + count; c++) {
                    data[c].count += 1;
                }
            }
        }
    }

    const res2 = data.reduce((count, game) => game.count + count, 0);

    console.log('2.', res2);
};

export {};
