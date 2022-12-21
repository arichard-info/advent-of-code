const { EOL } = require('os');

interface Monkey {
    id: string;
    value?: number;
    monkey1?: string;
    monkey2?: string;
    op?: '*' | '/' | '-' | '+';
}

type Monkeys = { [key: string]: Monkey };

const parseData = (data: string): Monkeys =>
    data.split(EOL).reduce((monkeys, row) => {
        const [left, right] = row.split(': ');
        if (Number.isInteger(+right)) return { ...monkeys, [left]: { id: left, value: +right } };
        const [monkey1, op, monkey2] = right.split(' ');
        return { ...monkeys, [left]: { id: left, value: undefined, monkey1, monkey2, op } };
    }, {});

const getMonkeyValue = (monkeysObj: Monkeys, monkey: Monkey): number => {
    if (monkey.value) return monkey.value;
    if (monkey.monkey1 && monkey.monkey2) {
        const v1 = getMonkeyValue(monkeysObj, monkeysObj[monkey.monkey1]);
        const v2 = getMonkeyValue(monkeysObj, monkeysObj[monkey.monkey2]);
        switch (monkey.op) {
            case '*':
                return v1 * v2;
            case '/':
                return v1 / v2;
            case '+':
                return v1 + v2;
            case '-':
                return v1 - v2;
        }
    }
    return 0; // should not happen
};
const part1 = (rawData: string): number => {
    const monkeysObj = parseData(rawData);
    return getMonkeyValue(monkeysObj, monkeysObj.root);
};

const getAncestors = (monkeys: Monkeys, monkey: Monkey): Monkey[] => {
    const result = [];
    while (monkey.id !== 'root') {
        result.unshift(monkey);
        const parent = Object.values(monkeys).find((m) =>
            [m.monkey1, m.monkey2].includes(monkey.id)
        ) as Monkey;
        monkey = parent;
    }
    return result;
};

const part2 = (rawData: string) => {
    const monkeysObj = parseData(rawData);
    const ancestors = getAncestors(monkeysObj, monkeysObj.humn);

    const getOtherMonkey = (monkey: Monkey, toAvoid: Monkey): Monkey => {
        const id = monkey.monkey1 === toAvoid.id ? (monkey.monkey2 as string) : (monkey.monkey1 as string);
        return monkeysObj[id];
    };

    const humanSideMonkey = ancestors[0];
    const otherSideMonkey = getOtherMonkey(monkeysObj.root, humanSideMonkey);

    let currentValue = getMonkeyValue(monkeysObj, otherSideMonkey);

    for (let i = 0; i < ancestors.length - 1; i++) {
        const currentMonkey = ancestors[i];
        const nextMonkey = ancestors[i + 1];
        const otherMonkey = getOtherMonkey(currentMonkey, nextMonkey);
        const otherValue = getMonkeyValue(monkeysObj, otherMonkey);

        if (currentMonkey.monkey1 === nextMonkey.id) {
            if (currentMonkey.op === '*') currentValue = currentValue / otherValue;
            if (currentMonkey.op === '/') currentValue = currentValue * otherValue;
            if (currentMonkey.op === '+') currentValue = currentValue - otherValue;
            if (currentMonkey.op === '-') currentValue = currentValue + otherValue;
        } else {
            if (currentMonkey.op === '*') currentValue = currentValue / otherValue;
            if (currentMonkey.op === '/') currentValue = otherValue / currentValue;
            if (currentMonkey.op === '+') currentValue = currentValue - otherValue;
            if (currentMonkey.op === '-') currentValue = otherValue - currentValue;
        }
    }

    return currentValue;
};

module.exports = (rawData: string) => {
    console.log('1.', part1(rawData));
    console.log('2.', part2(rawData));
};

export {};
