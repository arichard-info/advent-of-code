const { EOL } = require('os');

const { PriorityQueue } = require('commons/lib/priorityQueue');
const positions = [[-1, 0],[1, 0],[0, -1],[0, 1]];

const parseData = (data) => data.split(EOL).map(row => row.split('').map(Number));

const solve = (grid, tilesRatio = 1) => {
    const sizeX = grid[0].length;
    const sizeY = grid.length;

    const endPosition = [(sizeX * tilesRatio) - 1, (sizeY * tilesRatio) - 1];
    const queue = new PriorityQueue();
    queue.push({ point: [0, 0], risk: 0 }, 0);
    const visited = {};

    while(!queue.isEmpty()) {
        const { element: { point: current, risk } } = queue.pop();

        if(visited[`${current[0]}-${current[1]}`]) continue;
        visited[`${current[0]}-${current[1]}`] = true;

        if (current[0] === endPosition[0] && current[1] === endPosition[1]) return risk;
        
        positions.forEach((pos) => {
            const y = current[1] + pos[1];
            const x = current[0] + pos[0];

            if(x <= endPosition[1] && x >= 0 && y <= endPosition[0] && y >= 0) {
                const originalRisk = grid[y % sizeX][x % sizeY];
                const overflow = Math.floor(x / sizeX) + Math.floor((y / sizeY));
                
                let newRisk = originalRisk + overflow;
                newRisk = newRisk - (Math.ceil(newRisk / 9 - 1) * 9)
                newRisk = newRisk + risk;

                queue.push({ point: [x, y], risk: newRisk }, 0 - newRisk);
            }
        })
    }
}

module.exports = (rawData) => {
    const data = parseData(rawData);
    const res1 = solve(data);
    console.log('1.', res1);

    const res2 = solve(data, 5);
    console.log('2.', res2);
}
