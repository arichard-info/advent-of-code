/**
 * Deep clone object or array
 * @param {*} value
 * @returns
 */
const deepClone = (value) => {
    return JSON.parse(JSON.stringify(value));
};

const manhattanDistance = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

module.exports = {
    deepClone,
    manhattanDistance,
};
