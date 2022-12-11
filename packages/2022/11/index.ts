const { EOL } = require('os');

interface Monkey {
    id: number;
    items: number[];
    inspectCount: number;
    inspect: Function;
    action: Function;
}

const getInspectFn =
    (operation: string) =>
    (old: number): number => {
        const newOperation = operation.replace(/old/g, old.toString());
        return eval(newOperation);
    };

const getActionFn = (divisor: number, truthy: number, falsy: number) => (value: number) => {
    if (value % divisor) return falsy;
    return truthy;
};

const getGreatestCommonDivisor = (a: number, b: number): number => {
    if (a === 0) return b;
    return getGreatestCommonDivisor(b % a, a);
};

const getLeastCommonMultiple = (a: number, b: number): number => {
    return Math.abs(a * b) / getGreatestCommonDivisor(a, b);
};

const regex =
    /((?<=Monkey )(.*)(?=:))|((?<=Starting items: )(.*))|((?<=Operation: new = )(.*))|((?<=Test: divisible by )(.*))|((?<=If true: throw to monkey )(.*))|((?<=If false: throw to monkey )(.*))/gm;

const parseData = (data: string): { monkeys: Monkey[]; commonMultiple: number } => {
    let commonMultiple = 1;

    const monkeys = data.split(EOL + EOL).map((rawMonkey) => {
        const [index, items, operation, divisor, truthy, falsy] = rawMonkey.match(
            regex
        ) as string[];
        commonMultiple = getLeastCommonMultiple(commonMultiple, +divisor);
        return {
            id: +index,
            items: items.split(', ').map((i) => +i),
            inspectCount: 0,
            inspect: getInspectFn(operation),
            action: getActionFn(+divisor, +truthy, +falsy),
        };
    });

    return { monkeys, commonMultiple };
};

const playGame = (
    monkeys: Monkey[],
    rounds: number,
    commonMultiple: number,
    worryDivider: number = 1
): Monkey[] => {
    for (let i = 0; i < rounds; i++) {
        for (let m = 0; m < monkeys.length; m++) {
            monkeys[m].items.forEach((item: number) => {
                monkeys[m].inspectCount++;
                const worryLevel =
                    Math.floor(monkeys[m].inspect(item) / worryDivider) % commonMultiple;
                const target = monkeys[m].action(worryLevel, m === 2 && item === 79);
                monkeys[target].items.push(worryLevel);
            });
            monkeys[m].items = [];
        }
    }
    return monkeys;
};

module.exports = (rawData: string) => {
    const part1 = () => {
        const { monkeys, commonMultiple } = parseData(rawData);
        const resMonkeys = playGame(monkeys, 20, commonMultiple, 3);
        const [first, second] = resMonkeys.map((m) => m.inspectCount).sort((a, b) => b - a);
        console.log('1.', first * second);
    };

    const part2 = () => {
        const { monkeys, commonMultiple } = parseData(rawData);
        const resMonkeys = playGame(monkeys, 10000, commonMultiple);
        const [first, second] = resMonkeys.map((m) => m.inspectCount).sort((a, b) => b - a);
        console.log('2.', first * second);
    };

    part1();
    part2();
};

export {};
