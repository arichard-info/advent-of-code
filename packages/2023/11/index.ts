const { EOL } = require('os');

const parseData = (data: string): string[][] => data.split(EOL).map((r) => r.split(''));

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    const countShortestPaths = (expansion = 1) => {
        const emptyRows = [];
        for (let i = 0; i < data.length; i++) {
            if (!data[i].some((c) => c === '#')) {
                emptyRows.push(i);
            }
        }

        const emptyCols = [];
        for (let j = 0; j < data[0].length; j++) {
            if (!data.map((row) => row[j]).some((c) => c === '#')) {
                emptyCols.push(j);
            }
        }

        const galaxies = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] === '#') {
                    galaxies.push([i, j]);
                }
            }
        }

        let result = 0;
        for (let i = 0; i < galaxies.length - 1; i++) {
            const [r1, c1] = galaxies[i];
            for (let j = i + 1; j < galaxies.length; j++) {
                const [r2, c2] = galaxies[j];
                const rows = [r1, r2].sort((a, b) => a - b);
                const cols = [c1, c2].sort((a, b) => a - b);
                let nCrosses = 0;
                for (const r of emptyRows) {
                    if (rows[0] < r && r < rows[1]) {
                        nCrosses++;
                    }
                }
                for (const c of emptyCols) {
                    if (cols[0] < c && c < cols[1]) {
                        nCrosses++;
                    }
                }
                result += rows[1] - rows[0] + cols[1] - cols[0] + nCrosses * (expansion - 1);
            }
        }
        return result;
    };

    console.log('1.', countShortestPaths(2));
    console.log('2.', countShortestPaths(1000000));
};

export {};
