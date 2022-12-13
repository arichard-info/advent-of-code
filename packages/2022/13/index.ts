const { EOL } = require('os');
const { deepEqual } = require('commons/lib');

type RecursiveArray = Array<RecursiveArray | number>;

const parseData = (data: string): [RecursiveArray, RecursiveArray][] => {
    return data.split(EOL + EOL).map((rawPair) => {
        const [first, second] = rawPair.split(EOL);
        return [JSON.parse(first), JSON.parse(second)];
    });
};

const isValidPair = (first: RecursiveArray, second: RecursiveArray): number => {
    for (let index = 0; index < first.length; index++) {
        if (second[index] === undefined) return -1;

        if (typeof first[index] === 'number' && typeof second[index] === 'number') {
            if (first[index] < second[index]) return 1;
            else if (first[index] > second[index]) return -1;
        } else {
            const validPair = isValidPair(
                [first[index]].flat() as RecursiveArray,
                [second[index]].flat() as RecursiveArray
            );
            if (validPair) return validPair;
        }
    }
    if (first.length > second.length) return -1;
    if (first.length < second.length) return 1;
    return 0;
};

const sumOfValidIndexes = (pairs: [RecursiveArray, RecursiveArray][]): number => {
    return pairs.reduce(
        (count: number, pair: [RecursiveArray, RecursiveArray], index: number): number => {
            if (isValidPair(...pair) > 0) return count + index + 1;
            return count;
        },
        0
    );
};

const sortPackets = (packets: RecursiveArray[]): RecursiveArray[] => {
    const additionalPackets = [[[2]], [[6]]];
    packets.push(...additionalPackets);
    return packets.sort((a, b) => isValidPair(b, a));
};

const findDividersIndexes = (packets: RecursiveArray[]): number => {
    let first = -1;
    for (let i = 0; i < packets.length; i++) {
        if (JSON.stringify(packets[i]) === JSON.stringify([[2]])) first = i + 1;
        if (JSON.stringify(packets[i]) === JSON.stringify([[6]])) {
            return first * (i + 1);
        }
    }
    return 0;
};

module.exports = (rawData: string) => {
    const pairs = parseData(rawData);
    console.log('1.', sumOfValidIndexes(pairs));

    const sortedPackets = sortPackets(pairs.flat());
    console.log('2.', findDividersIndexes(sortedPackets));
};

export {};
