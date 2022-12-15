const { EOL } = require('os');
const { manhattanDistance } = require('commons/lib');

type Point = [number, number];
type Report = { sensor: Point; beacon: Point; distance: number };

const parseData = (data: string): Report[] => {
    return data.split(EOL).map((line) => {
        const [x1, y1, x2, y2] = line.match(/-?\d+/gm) as string[];
        const sensor = [+x1, +y1] as Point;
        const beacon = [+x2, +y2] as Point;
        return {
            sensor,
            beacon,
            distance: manhattanDistance(sensor, beacon),
        };
    });
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);
    console.log(data);

    console.log('1.');

    console.log('2.');
};

export {};
