const parseData = (str) => str.split('\n').map(r => r.split('').map(Number));

const getMinimumsArray = arr => {
    const mins = [];
    for(let row = 0; row < arr.length; row++) {
        for(let col = 0; col < arr[row].length; col++) {
            if(
                (arr[row-1]?.[col] === undefined || arr[row-1]?.[col] > arr[row][col]) && 
                (arr[row+1]?.[col] === undefined || arr[row+1]?.[col] > arr[row][col]) && 
                (arr[row]?.[col-1] === undefined || arr[row]?.[col-1] > arr[row][col]) && 
                (arr[row]?.[col+1] === undefined || arr[row]?.[col+1] > arr[row][col])
            ) {
                mins.push(arr[row][col]);
            }
        }
    }
    return mins;
}

const calcTotal = (minimums) => {
    return minimums.reduce((total, value) => total + value + 1, 0)
}


const getMinimumsPositions = arr => {
    const mins = [];
    for(let row = 0; row < arr.length; row++) {
        for(let col = 0; col < arr[row].length; col++) {
            if(
                (arr[row-1]?.[col] === undefined || arr[row-1]?.[col] > arr[row][col]) && 
                (arr[row+1]?.[col] === undefined || arr[row+1]?.[col] > arr[row][col]) && 
                (arr[row]?.[col-1] === undefined || arr[row]?.[col-1] > arr[row][col]) && 
                (arr[row]?.[col+1] === undefined || arr[row]?.[col+1] > arr[row][col])
            ) {
                mins.push({row, col});
            }
        }
    }
    return mins;
}

const countGreaterNeighbors = ({row, col}, arr, registered) => {
    let count = 0;
    registered[`${row}-${col}`] = true;

    if(row === undefined || row === undefined) return count;

    if(arr[row-1]?.[col] !== 9 && arr[row-1]?.[col] > arr[row][col]) {
        if(!registered[`${row-1}-${col}`]) count++;
        count+= countGreaterNeighbors({row: row-1, col}, arr, registered);
    }
    if(arr[row+1]?.[col] !== 9 && arr[row+1]?.[col] > arr[row][col]) {
        if(!registered[`${row+1}-${col}`]) count++;
        count+= countGreaterNeighbors({ row: row+1, col }, arr, registered);
    }
    if(arr[row]?.[col-1] !== 9 && arr[row]?.[col-1] > arr[row][col]) {
        if(!registered[`${row}-${col-1}`]) count++;
        count+= countGreaterNeighbors({row, col: col-1}, arr, registered);
    }
    if(arr[row]?.[col+1] !== 9 && arr[row]?.[col+1] > arr[row][col]) {
        if(!registered[`${row}-${col+1}`]) count++;
        count+= countGreaterNeighbors({row, col: col+1}, arr, registered);
    }
    

    return count;
}

module.exports = (rawData) => {
    const arr = parseData(rawData);
    const minimums = getMinimumsArray(arr);
    const total = calcTotal(minimums);
    console.log('1.', total)

    const minimumsPositions = getMinimumsPositions(arr);
    const basins = minimumsPositions.map(p => 1 + countGreaterNeighbors(p, arr, {})).sort((a, b) => b - a)
    const uniqueBasins = [...new Set(basins)]
    const threeLargest = uniqueBasins.slice(0,3)
    const res = basins.filter(b => threeLargest.includes(b)).reduce((total, value) => total * value, 1)
    console.log('2.', res)
}

