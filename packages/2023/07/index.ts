const { EOL } = require('os');

type Hand = {
    hand: string;
    score: number;
};

const getCardValues = (enableJoker = false): { [key: string]: number } => ({
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7,
    '9': 8,
    T: 9,
    J: enableJoker ? 0 : 10,
    Q: 11,
    K: 12,
    A: 13,
});

const parseData = (data: string): Hand[] =>
    data.split(EOL).map((row) => ({ hand: row.split(' ')[0], score: +row.split(' ')[1] }));

const getHandKind = (hand: Hand, enableJoker = false): number => {
    const charsMap = new Map<string, number>();
    hand.hand.split('').forEach((char) => {
        if (!charsMap.get(char)) charsMap.set(char, 1);
        else charsMap.set(char, (charsMap.get(char) as number) + 1);
    });
    const kind = Array.from(charsMap.values()).sort().join('');
    switch (kind) {
        case '5':
            return 6;

        case '14': {
            if (enableJoker && charsMap.get('J')) return 6;
            return 5;
        }

        case '23': {
            if (enableJoker && charsMap.get('J')) return 6;
            return 4;
        }

        case '113': {
            if (enableJoker && charsMap.get('J')) return 5;
            return 3;
        }

        case '122': {
            if (enableJoker) {
                if (charsMap.get('J') === 1) return 4;
                if (charsMap.get('J') === 2) return 5;
            }
            return 2;
        }

        case '1112': {
            if (enableJoker && charsMap.get('J')) return 3;
            return 1;
        }

        case '11111': {
            if (enableJoker && charsMap.get('J')) return 1;
            return 0;
        }
    }

    return 0;
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    const cards = getCardValues();
    const sortedHands = data.sort((handA, handB) => {
        const handAKind = getHandKind(handA);
        const handBKind = getHandKind(handB);
        if (handAKind === handBKind) {
            for (let i = 0; i < handA.hand.length; i++) {
                if (cards[handA.hand[i]] === cards[handB.hand[i]]) continue;
                return cards[handA.hand[i]] - cards[handB.hand[i]];
            }
        }
        return handAKind - handBKind;
    });

    const res1 = sortedHands.reduce((value, hand, index) => {
        return value + hand.score * (index + 1);
    }, 0);

    console.log('1.', res1);

    const cards2 = getCardValues(true);
    const sortedHands2 = data.sort((handA, handB) => {
        const handAKind = getHandKind(handA, true);
        const handBKind = getHandKind(handB, true);
        if (handAKind === handBKind) {
            for (let i = 0; i < handA.hand.length; i++) {
                if (cards2[handA.hand[i]] === cards2[handB.hand[i]]) continue;
                return cards2[handA.hand[i]] - cards2[handB.hand[i]];
            }
        }
        return handAKind - handBKind;
    });

    const res2 = sortedHands2.reduce((value, hand, index) => {
        return value + hand.score * (index + 1);
    }, 0);

    console.log('2.', res2);
};

export {};
