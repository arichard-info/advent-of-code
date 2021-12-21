const { deepClone } = require('./../../utils')

const parseData = (data) => {
    return data.split('\n').map(row => {
        const [player, position] = row.match(/[0-9]+/gm);
        return { id: Number(player), position: Number(position), score: 0 }
    })
}

const play = (data) => {
    const players = deepClone(data)
    let diceValue = 1;
    let countRounds = 0;
    let looser;
    while (!looser) {
        for (let i = 0; i < players.length; i++) {
            countRounds++;
            diceValue += 3;
            const newPosition = ((players[i].position + ((diceValue * 3) + 3)) % 10) + 1;
            players[i].score += newPosition;
            players[i].position = newPosition;

            if (players[i].score >= 1000) {
                return {
                    looser: players.find((p, index) => index !== i),
                    countRounds
                }
            }
        }
    }
}


const play2 = (data) => {
    const memo = [];
    const board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const run = (pos1, pos2, score1, score2, pIndex) => {
        if (memo[[pos1, pos2, score1, score2, pIndex]] !== undefined) {
            return memo[[pos1, pos2, score1, score2, pIndex]]
        }
        if (score1 >= 21) {
            memo[[pos1, pos2, score1, score2, pIndex]] = [1, 0];
            return [1, 0];
        }
        if (score2 >= 21) {
            memo[[pos1, pos2, score1, score2, pIndex]] = [0, 1];
            return [0, 1];
        }

        let totalWins = [0, 0]
        for (const d1 of [1, 2, 3]) {
            for (const d2 of [1, 2, 3]) {
                for (const d3 of [1, 2, 3]) {
                    let currWin;
                    if (pIndex === 0) {
                        const newPos = board[(pos1 + d1 + d2 + d3 - 1) % 10]
                        currWin = run(newPos, pos2, score1 + newPos, score2, 1 - pIndex)
                    } else {
                        const newPos = board[(pos2 + d1 + d2 + d3 - 1) % 10]
                        currWin = run(pos1, newPos, score1, score2 + newPos, 1 - pIndex)
                    }
                    totalWins = [totalWins[0] + currWin[0], totalWins[1] + currWin[1]]
                }
            }
        }
        memo[[pos1, pos2, score1, score2, pIndex]] = totalWins
        return totalWins;
    }

    const res = run(data[0].position, data[1].position, 0, 0, 0, 0);
    return res;
}

module.exports = (rawData) => {
    const data = parseData(rawData);
    const { looser, countRounds } = play(data);
    const res = looser.score * (countRounds * 3)
    console.log('1.', res)

    const universesRes = play2(data);
    const max = Math.max(...universesRes);
    console.log('2.', max)
}