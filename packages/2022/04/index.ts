const { EOL } = require('os')

type Range = [number, number]
type Pair = [Range, Range]

const parseData = (data: string): Pair[] =>
    data.split(EOL).map((rawPair: string) => {
        const rawRanges = rawPair.split(',')
        return [
            [+rawRanges[0].split('-')[0], +rawRanges[0].split('-')[1]],
            [+rawRanges[1].split('-')[0], +rawRanges[1].split('-')[1]],
        ]
    })

const countFullOverlapRanges = (pairs: Pair[]): number => {
    return pairs.reduce((count: number, pair: Pair): number => {
        if (
            (pair[0][0] >= pair[1][0] && pair[0][1] <= pair[1][1]) ||
            (pair[1][0] >= pair[0][0] && pair[1][1] <= pair[0][1])
        ) {
            count += 1
        }
        return count
    }, 0)
}

const countPartialOverlapRanges = (pairs: Pair[]): number => {
    return pairs.reduce((count: number, pair: Pair): number => {
        if (
            (pair[0][0] >= pair[1][0] && pair[0][0] <= pair[1][1]) ||
            (pair[0][1] >= pair[1][0] && pair[0][1] <= pair[1][1]) ||
            (pair[1][0] >= pair[0][0] && pair[1][0] <= pair[0][1]) ||
            (pair[1][1] >= pair[0][0] && pair[1][1] <= pair[0][1])
        ) {
            count += 1
        }
        return count
    }, 0)
}

module.exports = (rawData: string) => {
    const ranges = parseData(rawData)

    const res1 = countFullOverlapRanges(ranges)
    console.log('1.', res1)

    const res2 = countPartialOverlapRanges(ranges)
    console.log('2.', res2)
}

export {}
