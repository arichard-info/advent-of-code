const parseData = (str) => {
    [rawCoordinates, rawInstructions] = str.split('\n\n');
    const instructions = rawInstructions.split('\n').map(instruction => {
        if(instruction.match(/fold along x=/g)) return { x: Number(instruction.replace(/fold along x=/gm, '')) }
        if(instruction.match(/fold along y=/g)) return { y: Number(instruction.replace(/fold along y=/gm, '')) }
    })
    return {
        coordinates: rawCoordinates.split('\n').map(pair => pair.split(',').map(Number)),
        instructions
    }
}

const fold = (arr, instruction) => {
    return arr.map(([x, y]) => {
        if(instruction.y  && y > instruction.y) y = instruction.y-(y-instruction.y);
        if(instruction.x  && x > instruction.x) x = instruction.x-(x-instruction.x);
        return [x, y]
    }).filter(([x, y]) => {
        if(instruction.y) return y !== instruction.y;
        if(instruction.x) return x !== instruction.x;
        return true;
    });
}

const drawCoordinates = (coordinates) => {
    const maxX = Math.max(...coordinates.map(c => c[0]));
    const maxY = Math.max(...coordinates.map(c => c[1]));

    const arr = [...Array(maxY + 1)].map(e => new Array(maxX + 1).fill(' '));

    coordinates.forEach(([x, y]) => {
        arr[y][x] = '#';
    });
    return arr.map(row => row.join('')).join('\n');
}

module.exports = (rawData) => {
    const data = parseData(rawData);
    let coordinates = data.coordinates;

    data.instructions.forEach((instruction, index) => {
        coordinates = fold(coordinates, instruction);
        if(index === 0) {
            const sum = (new Set(coordinates.map(([x, y]) => `${x}-${y}`))).size;
            console.log('1.', sum);
        }
    })

    const draw = drawCoordinates(coordinates);
    console.log('2.');
    console.log(draw);
};
