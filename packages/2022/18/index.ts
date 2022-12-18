const { EOL } = require('os');

type Point = [number, number, number];

const parseData = (data: string): Point[] =>
    data.split(EOL).map((rawPoint) => rawPoint.split(',').map(Number) as Point);

const countFaces = (cubes: Point[]): { surface: number; min: Point; max: Point } => {
    const cubeSet = new Set<string>(cubes.map((cube) => cube.toString()));
    let surface = 0;
    let min: Point = [Infinity, Infinity, Infinity];
    let max: Point = [0, 0, 0];
    cubes.forEach((cube) => {
        let sides = 6;
        for (let i = -1; i <= 1; i += 2) {
            let x = [cube[0] + i, cube[1], cube[2]];
            let y = [cube[0], cube[1] + i, cube[2]];
            let z = [cube[0], cube[1], cube[2] + i];
            if (cubeSet.has(x.toString())) sides--;
            if (cubeSet.has(y.toString())) sides--;
            if (cubeSet.has(z.toString())) sides--;
        }
        surface += sides;
        min = [Math.min(min[0], cube[0] - 1), Math.min(min[1], cube[1] - 1), Math.min(min[2], cube[2] - 1)];
        max = [Math.max(max[0], cube[0] + 1), Math.max(max[1], cube[1] + 1), Math.max(max[2], cube[2] + 1)];
    });
    return { surface, min, max };
};

const countVisibleFaces = (cubes: Point[], min: Point, max: Point) => {
    const cubeSet = new Set<string>(cubes.map((cube) => cube.toString()));
    const emptySet = new Set<string>();
    for (let x = min[0]; x <= max[0]; x++) {
        for (let y = min[1]; y <= max[1]; y++) {
            for (let z = min[2]; z <= max[2]; z++) {
                if (!cubeSet.has([x, y, z].toString())) {
                    emptySet.add([x, y, z].toString());
                }
            }
        }
    }
    const visited = new Set<string>();
    let stack = [min.toString()];
    while (stack.length) {
        let emptyStr = stack.pop() as string;
        let empty = emptyStr.split(',').map(Number);
        visited.add(emptyStr);
        emptySet.delete(emptyStr);
        for (let i = -1; i <= 1; i += 2) {
            let x = [empty[0] + i, empty[1], empty[2]].toString();
            let y = [empty[0], empty[1] + i, empty[2]].toString();
            let z = [empty[0], empty[1], empty[2] + i].toString();
            if (emptySet.has(x) && !visited.has(x)) stack.push(x);
            if (emptySet.has(y) && !visited.has(y)) stack.push(y);
            if (emptySet.has(z) && !visited.has(z)) stack.push(z);
        }
    }
    const emptyCubes = Array.from(emptySet).map((str) => str.split(',').map(Number)) as Point[];
    return countFaces(cubes).surface - countFaces(emptyCubes).surface;
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);
    const { surface, min, max } = countFaces(data);
    console.log('1.', surface);
    console.log('2.', countVisibleFaces(data, min, max));
};

export {};
