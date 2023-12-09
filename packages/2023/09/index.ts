const { EOL } = require('os');

const parseData = (data: string): number[][] => data.split(EOL).map((r) => r.split(' ').map((c) => +c));

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    let res1 = 0;
    let res2 = 0;
    data.forEach((row) => {
        const sequences = [row];
        let currentSequence = row;

        while (currentSequence.some((s) => s !== 0)) {
            const newSequence = [];
            for (let i = 1; i < currentSequence.length; i++) {
                newSequence.push(currentSequence[i] - currentSequence[i - 1]);
            }
            sequences.push(newSequence);
            currentSequence = newSequence;
        }

        let endValue = 0;
        let startValue = 0;
        sequences.reverse().forEach((sequence) => {
            endValue = sequence[sequence.length - 1] + endValue;
            startValue = sequence[0] - startValue;
        });
        res1 += endValue;
        res2 += startValue;
    });

    console.log('1.', res1);
    console.log('2.', res2);
};

export {};
