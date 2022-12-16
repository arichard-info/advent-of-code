/**
 * Deep clone object or array
 * @param {*} value
 * @returns
 */
const deepClone = (value) => {
    return JSON.parse(JSON.stringify(value));
};

const manhattanDistance = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const memo = (func) => {
    const cache = new Map();
    return (...args) => {
        const key = args.join();
        if (cache.has(key)) {
            return cache.get(key);
        } else {
            const val = func(...args);
            cache.set(key, val);
            return val;
        }
    };
};

module.exports = {
    deepClone,
    manhattanDistance,
    memo,
};
