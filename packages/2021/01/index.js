const { EOL } = require("os");

const parseData = (data) => data.split(EOL).map(Number);
const increaseSum = (arr) => arr.reduce((number, depth, index) => arr[index+1] && arr[index+1] > depth ? number + 1 : number, 0);

module.exports = (rawData) => {
    const data = parseData(rawData)
    const res1 = increaseSum(data);

    const res2 = increaseSum(data.reduce((sums, depth, index) => {
        if(data[index-1] && data[index+1]) sums.push(data[index - 1] + depth + data[index + 1]);
        return sums;
    }, []));

    console.log('1.', res1)
    console.log('2.', res2)
}
