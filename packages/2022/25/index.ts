const { EOL } = require('os');

const parseData = (data: string): string[] => data.split(EOL);

const sums: { [k: string]: any } = {
    '==': '-1',
    '=-': '-2',
    '=0': '0=',
    '=1': '0-',
    '=2': '00',
    '-=': '-2',
    '--': '0=',
    '-0': '0-',
    '-1': '00',
    '-2': '01',
    '0=': '0=',
    '0-': '0-',
    '00': '00',
    '01': '01',
    '02': '02',
    '1=': '0-',
    '1-': '00',
    '10': '01',
    '11': '02',
    '12': '1=',
    '2=': '00',
    '2-': '01',
    '20': '02',
    '21': '1=',
    '22': '1-',
};

//sum of two SNAFU numbers
const sum = (x: string, y: string): string => {
    let output = '';
    let carry = '0';
    for (let i = 1; x.at(-i) || y.at(-i); i++) {
        let digitSum = sums[(x.at(-i) ?? '0') + (y.at(-i) ?? '0')];
        let carrySum = sums[carry + digitSum[1]];
        output = carrySum[1] + output;
        carry = sums[digitSum[0] + carrySum[0]][1];
    }
    if (carry !== '0') output = carry + output;
    return output;
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    console.log(
        '1.',
        data.reduce((total, snafu) => sum(total, snafu))
    );

    console.log('2.');
};

export {};
