const path = require("path");
const fs = require("fs");

const getData = (parser) => {
    const pathname = path.resolve(__dirname)
    return parser(fs.readFileSync(`${pathname}/data.txt`).toString());
}

const parseData = (str) => str.split(',').map(Number);

const getOptimized = (data) => {
    const min = Math.min(...data);
    const max = Math.max(...data);

    let minimumCost;
    for(let i = min; i <= max; i++) {
        const costs = data.map(number => Math.abs(i - number));
        const cost = costs.reduce((count, c) => count + c);
        if(!minimumCost || cost < minimumCost) minimumCost = cost;
    }

    return minimumCost
}

const getOptimizedExp = (data) => {
    const min = Math.min(...data);
    const max = Math.max(...data);

    let minimumCost;
    for(let i = min; i <= max; i++) {
        const costs = data.map(number => getSum(Math.abs(i - number)));
        const cost = costs.reduce((count, c) => count + c);
        if(!minimumCost || cost < minimumCost) minimumCost = cost;
    }

    return minimumCost
}

const getSum = (length) => {
    let sum = 0;
    for(let i = 0; i <= length; i++) sum += i;
    return sum;
}

(() => {
    const data = getData(parseData);
    const res = getOptimized(data);
    const res2 = getOptimizedExp(data);

    console.log('1.', res);
    console.log('2.', res2);
})()