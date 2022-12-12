const { EOL } = require('os');
const { alphabet } = require('commons/lib/constants');

interface Cell {
    x: number;
    y: number;
}

type DistMap = {
    [id: string]: number;
};
type PrevMap = {
    [id: string]: string;
};

const parseData = (data: string): { grid: number[][]; start: Cell; end: Cell } => {
    let start!: Cell;
    let end!: Cell;
    const grid = data.split(EOL).map((row, y) =>
        row.split('').map((cell, x) => {
            if (cell === 'S') {
                start = { x, y };
                return 0;
            }
            if (cell === 'E') {
                end = { x, y };
                return 25;
            }
            return alphabet.indexOf(cell);
        })
    );

    return { grid, start, end };
};

const cellToString = (cell: Cell): string => {
    return [cell.x, cell.y].toString();
};

const stringToCell = (str: string): Cell => {
    const [x, y] = str.split(',');
    return { x: +x, y: +y };
};

const getNeighbors = (grid: number[][], position: Cell): string[] => {
    const res = [];
    const { x, y } = position;
    if (y + 1 < grid.length && grid[y + 1][x] <= grid[y][x] + 1) {
        res.push(cellToString({ x, y: y + 1 }));
    }
    if (y - 1 >= 0 && grid[y - 1][x] <= grid[y][x] + 1) {
        res.push(cellToString({ x, y: y - 1 }));
    }
    if (x + 1 < grid[y].length && grid[y][x + 1] <= grid[y][x] + 1) {
        res.push(cellToString({ x: x + 1, y }));
    }
    if (x - 1 >= 0 && grid[y][x - 1] <= grid[y][x] + 1) {
        res.push(cellToString({ x: x - 1, y }));
    }
    return res;
};

const dijkstra = (grid: number[][], start: Cell, end: Cell): { dist: DistMap; prev: PrevMap } => {
    const dist: DistMap = {};
    const prev: PrevMap = {};
    let queue = [];
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const id = cellToString({ x, y });
            dist[id] = Infinity;
            queue.push(id);
        }
    }
    dist[cellToString(start)] = 0;

    while (queue.length) {
        let u!: string;
        for (const current of queue) {
            if (!u || dist[current] < dist[u]) {
                u = current;
            }
        }
        if (u === cellToString(end)) {
            break;
        }
        queue = queue.filter((x) => x !== u);

        const point = stringToCell(u);
        const neighbors = getNeighbors(grid, point);
        for (const v of neighbors) {
            if (queue.includes(v)) {
                const alt = dist[u] + 1;
                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                }
            }
        }
    }
    return {
        dist,
        prev,
    };
};

const getNeighbors2 = (grid: number[][], position: Cell): string[] => {
    const res = [];
    const { x, y } = position;
    if (y + 1 < grid.length && grid[y + 1][x] >= grid[y][x] - 1) {
        res.push(cellToString({ x, y: y + 1 }));
    }
    if (y - 1 >= 0 && grid[y - 1][x] >= grid[y][x] - 1) {
        res.push(cellToString({ x, y: y - 1 }));
    }
    if (x + 1 < grid[y].length && grid[y][x + 1] >= grid[y][x] - 1) {
        res.push(cellToString({ x: x + 1, y }));
    }
    if (x - 1 >= 0 && grid[y][x - 1] >= grid[y][x] - 1) {
        res.push(cellToString({ x: x - 1, y }));
    }
    return res;
};

const dijkstra2 = (grid: number[][], start: Cell) => {
    const dist: DistMap = {};
    const prev: PrevMap = {};
    let queue = [];
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const id = cellToString({ x, y });
            dist[id] = Infinity;
            queue.push(id);
        }
    }
    dist[cellToString({ x: start.x, y: start.y })] = 0;

    while (queue.length) {
        let u!: string;
        for (const current of queue) {
            if (!u || dist[current] < dist[u]) {
                u = current;
            }
        }
        const point = stringToCell(u);
        if (grid[point.y][point.x] === 0) {
            return dist[u];
        }
        queue = queue.filter((x) => x !== u);

        const neighbors = getNeighbors2(grid, point);
        for (const v of neighbors) {
            if (queue.includes(v)) {
                const alt = dist[u] + 1;
                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                }
            }
        }
    }
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);
    const { dist } = dijkstra(data.grid, data.start, data.end);
    const distance = dist[cellToString({ x: data.end.x, y: data.end.y })];

    console.log('1. ', distance);
    console.log('2. ', dijkstra2(data.grid, data.end));
};

export {};
