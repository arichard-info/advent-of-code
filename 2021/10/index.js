const closingTags = {
    ')': { open: '(', penality: 3, value: 1 },
    ']': { open: '[', penality: 57, value: 2 },
    '}': { open: '{', penality: 1197, value: 3 },
    '>': { open: '<', penality: 25137, value: 4 }
}

const openingTags = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4
}

const parseData = (data) => data.split('\n');

const calcScore = (row) => {
    const open = [];
    for (let i = 0; i < row.length; i++) {
        if (!closingTags[row[i]]) open.push(row[i]);
        else {
            if (closingTags[row[i]].open === open[open.length - 1]) open.pop();
            else {
                return -closingTags[row[i]].penality;
            }
        }
    }
    return calcTotal(open);
}

const calcTotal = (tags) => tags.reverse().reduce((score, tag) => (score * 5) + openingTags[tag], 0);

module.exports = (rawData) => {
    const arr = parseData(rawData);
    const scores = arr.map(calcScore);
    const penality = scores.reduce((total, s) => {
        if (s < 0) return -s + total;
        return total;
    }, 0);
    console.log('1.', penality);

    const completionScores = scores.filter(s => s > 0).sort((a, b) => a - b);
    const index = Math.floor(completionScores.length / 2)
    const completionScore = completionScores[index]
    console.log('2.', completionScore);
}
