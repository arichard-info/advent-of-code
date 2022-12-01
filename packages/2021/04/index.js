const { EOL } = require('os');

const parseData = data => {
    const [rawNumbers, ...rawBoards] = data.split(EOL + EOL)
    return {
        numbers: rawNumbers.split(',').map(Number),
        boards: rawBoards.map(b => b.split(EOL).map(row => row.split(' ').filter(c => c !== "").map(Number)))
    }
}

const markBoard = (board, number) => {
    return board.map(row => {
        return row.map(value => {
            if (value === number) return -1;
            return value;
        })
    })
}

const testRows = (board) => board.some(row => row.every(value => value === -1));
const testCols = (board) => {
    const reverse = board[0].map((_, index) => board.map(row => row[index]).reverse())
    return testRows(reverse);
}

const isComplete = (board) => testRows(board) || testCols(board);

const play = (boards, numbers) => {
    for (let number of numbers) {
        boards = boards.map(b => markBoard(b, number));
        const complete = boards.find(isComplete);
        if (complete) return { winner: complete, number };
    };
}

const getScore = (board, multiplicator) => {
    const sum = board.reduce((score, row) => score + row.reduce((rowScore, number) => number !== -1 ? rowScore + number : rowScore, 0), 0);
    return sum * multiplicator;
}

const reversePlay = (boards, numbers) => {
    let last = false;
    for(let number of numbers) {
        if(last) return { looser: markBoard(boards[0], number), number };
        boards = boards.map(b => markBoard(b, number)).filter(b => !isComplete(b));
        if (boards.length === 1) last = true;
    }
}

module.exports = (rawData) => {
    const { boards, numbers } = parseData(rawData);

    const { winner, number: winnerNumber } = play(boards, numbers);
    const winnerScore = getScore(winner, winnerNumber);
    console.log('1.', winnerScore);


    const { looser, number: looserNumber } = reversePlay(boards, numbers);
    const looserScore = getScore(looser, looserNumber);
    console.log('2.', looserScore)

}