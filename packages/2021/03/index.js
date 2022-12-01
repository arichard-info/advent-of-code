const { EOL } = require('os');

const parseData = (data) => data.split(EOL);

const getCount = (arr, index) => {
    const count = {
        0: 0,
        1: 0
    };
    arr.forEach(code => {
        const digit = code[index];
        if (digit === "1") count['1'] += 1;
        if (digit === "0") count['0'] += 1;
    })
    return count;
}

const getCounts = (arr) => {
    const length = arr[0].split('').length;
    const count = [];
    for (let i = 0; i < length; i++) {
        count[i] = getCount(arr, i);
    }
    return count
}

const getGamma = (counts) => {
    return counts.reduce((str, count) => {
        if (count["1"] > count["0"]) str = str + "1";
        else str = str + "0"
        return str
    }, "")
}

const getEpsilon = (counts) => {
    return counts.reduce((str, count) => {
        if (count["1"] < count["0"]) str = str + "1";
        else str = str + "0"
        return str
    }, "")
}

const getLifeSupportRating = (arr) => {
    const length = arr[0].length;
    let tmpLeast = arr;
    let tmpMost = arr;
    for (let i = 0; i < length; i++) {
        const leastCount = getCount(tmpLeast, i);
        const least = leastCount['1'] < leastCount['0'] ? '1' : '0';
        if (tmpLeast.length > 1) tmpLeast = tmpLeast.filter(code => code[i] === least)

        const mostCount = getCount(tmpMost, i);
        const most = mostCount['1'] < mostCount['0'] ? '0' : '1';
        if (tmpMost.length > 1) tmpMost = tmpMost.filter(code => code[i] === most)
    }

    return parseInt(tmpMost, 2) * parseInt(tmpLeast, 2);
}



module.exports = (rawData) => {
    const data = parseData(rawData);

    const counts = getCounts(data);
    const gamma = getGamma(counts);
    const epsilon = getEpsilon(counts);

    const res = parseInt(gamma, 2) * parseInt(epsilon, 2);
    console.log('1.', res);

    const res2 = getLifeSupportRating(data);
    console.log('2.', res2)
}
