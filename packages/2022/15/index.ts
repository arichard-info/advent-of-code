const { EOL } = require('os');
const { manhattanDistance } = require('commons/lib');

type Point = [number, number];
type Report = { sensor: Point; beacon: Point; distance: number };

const parseData = (data: string): { reports: Report[]; beacons: Set<string> } => {
    let beacons = new Set<string>();
    const reports = data.split(EOL).map((line) => {
        const [x1, y1, x2, y2] = line.match(/-?\d+/gm) as string[];
        const sensor = [+x1, +y1] as Point;
        const beacon = [+x2, +y2] as Point;
        beacons.add(beacon.toString());
        return {
            sensor,
            beacon,
            distance: manhattanDistance(sensor, beacon),
        };
    });
    return { beacons, reports };
};

const countNotBeacons = (reports: Report[], beacons: Set<string>, line: number): number => {
    const positions = new Set<string>();
    reports.forEach((report) => {
        const [x, y] = report.sensor;
        for (let i = 0; i <= report.distance; i++) {
            if (-i + y === line || i + y === line) {
                for (let t = i - report.distance; t <= report.distance - i; t++) {
                    if (!beacons.has([t + x, i + y].toString()) && i + y === line) {
                        positions.add([t + x, i + y].toString());
                    }
                    if (!beacons.has([t + x, -i + y].toString()) && -i + y === line) {
                        positions.add([t + x, -i + y].toString());
                    }
                }
            }
        }
    });
    return positions.size;
};

const getDiamonds = (reports: Report[]): Point[][] => {
    const diamonds = [] as Point[][];
    reports.forEach((report) => {
        const d = report.distance + 1;
        const diamond = [] as Point[];
        diamond[0] = [report.sensor[0] + d, report.sensor[1]];
        diamond[1] = [report.sensor[0], report.sensor[1] + d];
        diamond[2] = [report.sensor[0] - d, report.sensor[1]];
        diamond[3] = [report.sensor[0], report.sensor[1] - d];
        diamonds.push(diamond);
    });
    return diamonds;
};

const intersect = ([x1, y1]: Point, [x2, y2]: Point, [x3, y3]: Point, [x4, y4]: Point): Point => {
    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);
    return [~~x, ~~y];
};

const getDistressBeaconPos = (reports: Report[], range: number) => {
    const diamonds = getDiamonds(reports);
    for (let i = 0; i < diamonds.length; i++) {
        const d1 = diamonds[i];
        for (let j = i + 1; j < diamonds.length; j++) {
            const d2 = diamonds[j];
            for (let s1 = 0; s1 < 4; s1++) {
                for (let s2 = 0; s2 < 4; s2++) {
                    let [xi, yi] = intersect(d1[s1], d1[(s1 + 1) % 4], d2[s2], d2[(s2 + 1) % 4]);
                    if (
                        xi >= 0 &&
                        xi <= range &&
                        yi >= 0 &&
                        yi <= range &&
                        reports.every(
                            (report) => manhattanDistance(report.sensor, [xi, yi]) > report.distance
                        )
                    ) {
                        return xi * 4000000 + yi;
                    }
                }
            }
        }
    }
};

module.exports = (rawData: string) => {
    const { reports, beacons } = parseData(rawData);
    console.log('1.', countNotBeacons(reports, beacons, reports.length === 14 ? 10 : 2000000));
    console.log('2.', getDistressBeaconPos(reports, reports.length === 14 ? 20 : 4000000));
};

export {};
