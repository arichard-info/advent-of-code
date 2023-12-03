const { EOL } = require('os');

const parseData = (data: string): string[][] => data.split(EOL).map((r) => r.split(''));

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    let res1 = 0;
    for (let y = 0; y < data.length; y++) {
        const row = data[y];
        let part = '';
        let isPart = false;
        for (let x = 0; x < row.length; x++) {
            const char = row[x];
            if (!isNaN(+char)) {
                part = part + char;
                for (let y1 = -1; y1 <= 1; y1++) {
                    for (let x1 = -1; x1 <= 1; x1++) {
                        if (
                            data[y + y1] &&
                            data[y + y1][x + x1] &&
                            data[y + y1][x + x1] !== '.' &&
                            isNaN(+data[y + y1][x + x1])
                        ) {
                            isPart = true;
                        }
                    }
                }
            }

            if (x === row.length - 1 || isNaN(+char)) {
                if (isPart) {
                    res1 += +part;
                    isPart = false;
                }
                part = '';
            }
        }
    }

    console.log('1.', res1);

    const gears: { [key: string]: number[] } = {};

    for (let y = 0; y < data.length; y++) {
        const row = data[y];
        let part = '';
        const tmpGears = new Set<string>();
        for (let x = 0; x < row.length; x++) {
            const char = row[x];
            if (!isNaN(+char)) {
                part = part + char;
                for (let y1 = -1; y1 <= 1; y1++) {
                    for (let x1 = -1; x1 <= 1; x1++) {
                        if (data[y + y1] && data[y + y1][x + x1] === '*') {
                            tmpGears.add(`${y + y1},${x + x1}`);
                        }
                    }
                }
            }

            if (x === row.length - 1 || isNaN(+char)) {
                if (tmpGears.size) {
                    tmpGears.forEach((tmpGear) => {
                        if (!gears[tmpGear]) gears[tmpGear] = [];
                        gears[tmpGear].push(+part);
                    });
                    tmpGears.clear();
                }
                part = '';
            }
        }
    }

    const res2 = Object.values(gears).reduce((sum: number, parts: number[]): number => {
        if (parts.length !== 2) return sum;
        return sum + parts.reduce((value: number, part: number) => value * part, 1);
    }, 0);

    console.log('2.', res2);
};

export {};
