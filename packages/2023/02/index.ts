const { EOL } = require('os');

type Cubes = {
    count: number;
    color: string;
};

type Game = {
    id: string;
    subsets: Cubes[][];
};

const parseData = (data: string): Game[] => {
    const rows = data.split(EOL);
    return rows.map((row) => {
        const [rawGameId, rawSubsets] = row.split(': ');
        return {
            id: rawGameId.split(' ')[1],
            subsets: rawSubsets.split('; ').map((rawSubset) =>
                rawSubset.split(', ').map((rawCube) => ({
                    count: +rawCube.split(' ')[0],
                    color: rawCube.split(' ')[1],
                }))
            ),
        };
    });
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    const testCubes: { [key: string]: number } = { red: 12, green: 13, blue: 14 };
    let idSum = 0;

    data.forEach(({ id, subsets }) => {
        let compatible = true;
        subsets.flat().forEach((cube) => {
            if (cube.count > testCubes[cube.color]) compatible = false;
        });

        if (compatible) idSum += +id;
    });

    console.log('1.', idSum);

    let powerSum = 0;
    data.forEach(({ subsets }) => {
        const maximums: { [key: string]: number } = { red: 0, green: 0, blue: 0 };
        subsets.flat().forEach((cube) => {
            if (cube.count > maximums[cube.color]) maximums[cube.color] = cube.count;
        });
        powerSum += maximums.red * maximums.green * maximums.blue;
    });

    console.log('2.', powerSum);
};

export {};
