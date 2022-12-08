const { EOL } = require('os');

const parseData = (data: string): number[][] =>
    data.split(EOL).map((row) => row.split('').map((tree) => +tree));

const getVisibilityMatrice = (map: number[][]): number[][] => {
    const countMatrice = map.map((row) => row.map((_) => 0));
    for (let index1 = 0; index1 < map.length; index1++) {
        let maxFromLeft = 0;
        let maxFromRight = 0;
        let maxFromTop = 0;
        let maxFromBottom = 0;
        for (let index2 = 0; index2 < map.length; index2++) {
            const index2R = map[index1].length - 1 - index2;

            if (index2 === 0 || map[index1][index2] > maxFromLeft) {
                countMatrice[index1][index2] += 1;
                maxFromLeft = map[index1][index2];
            }

            if (index2R === map[index1].length - 1 || map[index1][index2R] > maxFromRight) {
                countMatrice[index1][index2R] += 1;
                maxFromRight = map[index1][index2R];
            }

            if (index2 === 0 || map[index2][index1] > maxFromTop) {
                countMatrice[index2][index1] += 1;
                maxFromTop = map[index2][index1];
            }

            if (index2R === map[index1].length - 1 || map[index2R][index1] > maxFromBottom) {
                countMatrice[index2R][index1] += 1;
                maxFromBottom = map[index2R][index1];
            }
        }
    }

    return countMatrice;
};

const countVisibility = (visibilityMatrice: number[][]): number =>
    visibilityMatrice.reduce(
        (count: number, row: number[]) =>
            count +
            row.reduce(
                (rowCount: number, tree: number) => (tree !== 0 ? rowCount + 1 : rowCount),
                0
            ),
        0
    );

const getScoreMatrice = (map: number[][]): number[][] => {
    const countMatrice = map.map((row) => row.map((_) => 0));
    for (let index1 = 0; index1 < map.length; index1++) {
        for (let index2 = 0; index2 < map.length; index2++) {
            const right = map[index1].filter((_, i) => i > index2);
            const down = map.map((row) => row[index2]).filter((_, j) => j > index1);
            const left = map[index1].filter((_, i) => i < index2).reverse();
            const up = map
                .map((row) => row[index2])
                .filter((_, j) => j < index1)
                .reverse();
            countMatrice[index1][index2] =
                countTreesInView(up, map[index1][index2]) *
                countTreesInView(right, map[index1][index2]) *
                countTreesInView(down, map[index1][index2]) *
                countTreesInView(left, map[index1][index2]);
        }
    }

    return countMatrice;
};

const countTreesInView = (treeLine: number[], origin: number): number => {
    const blocker = treeLine.findIndex((t) => t >= origin);
    if (blocker === -1) return treeLine.length;
    return blocker + 1;
};

const findMax = (visibilityScoreMatrice: number[][]) => Math.max(...visibilityScoreMatrice.flat());

module.exports = (rawData: string) => {
    const map = parseData(rawData);
    const visibilityMatrice = getVisibilityMatrice(map);
    console.log('1.', countVisibility(visibilityMatrice));

    const visibilityScoreMatrice = getScoreMatrice(map);
    console.log('2.', findMax(visibilityScoreMatrice));
};

export {};
