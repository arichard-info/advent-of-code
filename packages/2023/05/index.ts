const { EOL } = require('os');
const fs = require('fs');
const path = require('path');

type Instruction = {
    id: string;
    source: string;
    destination: string;
    rules: { destinationRange: number; sourceRange: number; rangeLength: number }[];
};

const parseData = (data: string): { seeds: number[]; instructions: Instruction[] } => {
    const [rawSeeds, ...rawGroups] = data.split(EOL + EOL);
    const seeds = rawSeeds
        .split(': ')[1]
        .split(' ')
        .map((s) => +s);

    const instructions = rawGroups.map((rawGroup) => {
        const [rawName, ...rawRules] = rawGroup.split(EOL);
        const [id] = rawName.split(' ');
        const [source, destination] = id.split('-to-');
        return {
            id,
            source,
            destination,
            rules: rawRules.map((rawRule) => {
                const [destinationRange, sourceRange, rangeLength] = rawRule.split(' ').map((r) => +r);
                return { destinationRange, sourceRange, rangeLength };
            }),
        };
    });
    return { seeds, instructions };
};

const getDestination = (seedValue: number, destinationRange: number, sourceRange: number) => {
    const diff = seedValue - sourceRange;
    return destinationRange + diff;
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    let res1: number = Infinity;

    data.seeds.forEach((seed) => {
        let value = seed;
        data.instructions.forEach((instruction) => {
            for (let i = 0; i < instruction.rules.length; i++) {
                const rule = instruction.rules[i];
                if (value >= rule.sourceRange && value <= rule.sourceRange + rule.rangeLength) {
                    value = getDestination(value, rule.destinationRange, rule.sourceRange);
                    break;
                }
            }
        });

        if (value < res1) res1 = value;
    });

    console.log('1.', res1);

    const reversedInstructions = data.instructions.reverse();

    let minLocation = 0;
    while (true) {
        let seed = minLocation;
        reversedInstructions.forEach((instruction) => {
            for (let i = 0; i < instruction.rules.length; i++) {
                const rule = instruction.rules[instruction.rules.length - 1 - i];
                if (seed >= rule.destinationRange && seed <= rule.destinationRange + rule.rangeLength) {
                    seed = seed - rule.destinationRange + rule.sourceRange;
                    break;
                }
            }
        });

        let matchingSeed = null;
        for (let i = 0; i < data.seeds.length; i += 2) {
            if (seed >= data.seeds[i] && seed <= data.seeds[i] + data.seeds[i + 1]) {
                matchingSeed = seed;
            }
        }
        if (matchingSeed) break;

        minLocation++;
    }

    console.log('2.', minLocation);
};

export {};
