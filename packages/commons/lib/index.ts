const utils = require('./index');

const groupByN = (n: number, arr: any[]): any[][] => {
    const result = [];
    for (let i = 0; i < arr.length; i += n) result.push(arr.slice(i, i + n));
    return result;
};

module.exports = {
    ...utils,
    groupByN,
};
