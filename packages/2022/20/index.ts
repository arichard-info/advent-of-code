const { EOL } = require('os');

const parseData = (data: string): number[] => data.split(EOL).map(Number);

const rearangeData = (arr: number[], key: number = 1, rounds: number = 1): number[] => {
    const uniqueValuesArray = arr.map((v) => v * key).map((d) => [d]);
    const res = [...uniqueValuesArray];
    while (rounds--)
        uniqueValuesArray.forEach((v) => {
            const i = res.indexOf(v);
            res.splice(i, 1);
            res.splice((i + v[0]) % res.length, 0, v);
        });
    return res.flat();
};

const sumGroveCoords = (arr: number[]): number => {
    const zeroIndex = arr.findIndex((v) => v === 0);
    return [1000, 2000, 3000].reduce((value, index) => value + arr[(index + zeroIndex) % arr.length], 0);
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);
    const arr = rearangeData(data);
    console.log('1.', sumGroveCoords(arr));

    const arr2 = rearangeData(data, 811589153, 10);
    console.log('2.', sumGroveCoords(arr2));
};

export {};
