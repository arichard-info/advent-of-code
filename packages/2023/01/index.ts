const { EOL } = require('os');

const parseData = (data: string): string[] => {
    return data.split(EOL);
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    const res1 = data.reduce((acc: number, row: string): number => {
        let firstDigit = null;
        let lastDigit = null;

        for (let i = 0; i < row.length; i++) {
            if (!isNaN(+row[i])) {
                if (!firstDigit) firstDigit = row[i];
                lastDigit = row[i];
            }
        }

        return +`${firstDigit}${lastDigit}` + acc;
    }, 0);

    console.log('1.', res1);

    const replacements: { [key: string]: string } = {
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
    };

    const res2 = data.reduce((acc: number, rawRow: string): number => {
        const regex = new RegExp(Object.keys(replacements).join('|'));

        let ignoreLength = 0;
        let row = '';
        for (let i = 0; i < rawRow.length; i++) {
            const match = rawRow.substring(i).match(regex);
            if (match && match.index === 0) {
                row += replacements[match[0]];
                ignoreLength = match[0].length;
            } else if (!ignoreLength) {
                row += rawRow[i];
            }
            if (ignoreLength) ignoreLength--;
        }

        let firstDigit = null;
        let lastDigit = null;

        for (let i = 0; i < row.length; i++) {
            if (!isNaN(+row[i])) {
                if (!firstDigit) firstDigit = row[i];
                lastDigit = row[i];
            }
        }

        return +`${firstDigit}${lastDigit}` + acc;
    }, 0);

    console.log('2.', res2);
};

export {};
