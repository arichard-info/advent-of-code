const { EOL } = require('os');

interface Round {
    opponent: OpponentChoice,
    me: myChoice
}

enum OpponentChoice {
    ROCK = "A",
    PAPER = "B",
    SCISSORS = "C"
}

enum myChoice {
    ROCK = "X",
    PAPER = "Y",
    SCISSORS = "Z"
}

enum RoundStatus {
    VICTORY = "victory",
    DEFEAT = "defeat",
    NUL = "nul"
}

const statusMap = {
    [myChoice.ROCK+OpponentChoice.ROCK]: RoundStatus.NUL,
    [myChoice.ROCK+OpponentChoice.PAPER]: RoundStatus.DEFEAT,
    [myChoice.ROCK+OpponentChoice.SCISSORS]: RoundStatus.VICTORY,
    [myChoice.PAPER+OpponentChoice.PAPER]: RoundStatus.NUL,
    [myChoice.PAPER+OpponentChoice.ROCK]: RoundStatus.VICTORY,
    [myChoice.PAPER+OpponentChoice.SCISSORS]: RoundStatus.DEFEAT,
    [myChoice.SCISSORS+OpponentChoice.SCISSORS]: RoundStatus.NUL,
    [myChoice.SCISSORS+OpponentChoice.PAPER]: RoundStatus.VICTORY,
    [myChoice.SCISSORS+OpponentChoice.ROCK]: RoundStatus.DEFEAT,
}

const choiceScores = {
    [myChoice.ROCK]: 1,
    [myChoice.PAPER]: 2,
    [myChoice.SCISSORS]: 3
}

const statusScores = {
    [RoundStatus.VICTORY]: 6,
    [RoundStatus.DEFEAT]: 0,
    [RoundStatus.NUL]: 3
}

const expectedRoundStatus = {
    X: RoundStatus.DEFEAT,
    Y: RoundStatus.NUL,
    Z: RoundStatus.VICTORY,
}

const expectedScoresMap = {
    [OpponentChoice.ROCK+RoundStatus.NUL]: myChoice.ROCK,
    [OpponentChoice.ROCK+RoundStatus.DEFEAT]: myChoice.SCISSORS,
    [OpponentChoice.ROCK+RoundStatus.VICTORY]: myChoice.PAPER,
    [OpponentChoice.PAPER+RoundStatus.NUL]: myChoice.PAPER,
    [OpponentChoice.PAPER+RoundStatus.DEFEAT]: myChoice.ROCK,
    [OpponentChoice.PAPER+RoundStatus.VICTORY]: myChoice.SCISSORS,
    [OpponentChoice.SCISSORS+RoundStatus.NUL]: myChoice.SCISSORS,
    [OpponentChoice.SCISSORS+RoundStatus.DEFEAT]: myChoice.PAPER,
    [OpponentChoice.SCISSORS+RoundStatus.VICTORY]: myChoice.ROCK,
}

const parseData = (data: string): Round[] => data.split(EOL).map((rawRound: string): Round => ({
    opponent: rawRound.split(' ')[0] as OpponentChoice,
    me: rawRound.split(' ')[1] as myChoice
}));

module.exports = (rawData: string) => {
    const rounds = parseData(rawData);

    const score = rounds.reduce((acc: number, round: Round): number => {
        const status: RoundStatus = statusMap[round.me+round.opponent];
        return acc + choiceScores[round.me] + statusScores[status];
    }, 0);

    console.log('1.', score)

    const score2 = rounds.reduce((acc: number, round: Round) => {
        const expectedStatus: RoundStatus = expectedRoundStatus[round.me];
        const choice: myChoice = expectedScoresMap[round.opponent+expectedStatus];
        return acc + choiceScores[choice] + statusScores[expectedStatus];
    }, 0)

    console.log('2.', score2)
}
