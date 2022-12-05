const { EOL } = require('os');
const { deepClone } = require('commons/lib');

interface Instruction {
    length: number;
    from: number;
    to: number;
}

interface Input {
    stacks: string[][];
    instructions: Instruction[];
}

const parseStacks = (rawStacks: string): string[][] => {
    const stacks: string[][] = [];
    const rawLines = rawStacks.split(EOL);
    rawLines.pop();
    rawLines.reverse().forEach((line) => {
        for (let index = 0; index < line.length - 1; index += 4) {
            if (!stacks[index / 4]) stacks[index / 4] = [];
            if (line[index + 1] !== ' ') stacks[index / 4].push(line[index + 1]);
        }
    });
    return stacks;
};

const parseData = (data: string): Input => {
    const [rawStacks, rawInstructions] = data.split(EOL + EOL);
    const instructions = rawInstructions.split(EOL).map((rawInstruction) => {
        const [length, from, to] = rawInstruction.match(/[\d]{1,100}/gm) as string[];
        return {
            length: +length,
            from: +from - 1,
            to: +to - 1,
        };
    });
    return { stacks: parseStacks(rawStacks), instructions };
};

const applyInstructions = (
    startStacks: string[][],
    instructions: Instruction[],
    crateMoverVersion: number = 9000
): string[][] => {
    const stacks = deepClone(startStacks);
    instructions.forEach((instruction) => {
        const items = stacks[instruction.from].splice(-instruction.length);
        if (crateMoverVersion === 9001) {
            stacks[instruction.to].push(...items);
        } else {
            stacks[instruction.to].push(...items.reverse());
        }
    });
    return stacks;
};

const getTopStacks = (stacks: string[][]): string[] =>
    stacks.map((stack) => stack[stack.length - 1]);

module.exports = (rawData: string) => {
    const data = parseData(rawData);
    const finalStacks = applyInstructions(data.stacks, data.instructions);
    const topStacks = getTopStacks(finalStacks);

    console.log('1.', topStacks.join(''));

    const finalStacks2 = applyInstructions(data.stacks, data.instructions, 9001);
    const topStacks2 = getTopStacks(finalStacks2);
    console.log('2.', topStacks2.join(''));
};

export {};
