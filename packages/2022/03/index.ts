const { EOL } = require('os');
const { groupByN } = require('commons/lib/index.ts');

const alphabet: string = "abcdefghijklmnopqrstuvwxyz";

const splitStringInMiddle = (str: string): [string, string] => {
    const middle = str.length / 2;
    return [str.slice(0, middle), str.slice(middle, str.length)];
}

const getCommonCharacters = (rucksack: [string, string]): string[] => {
    const duplicates = new Set<string>();
    for (let i = 0; i < rucksack[0].length; i ++) {
        if (rucksack[1].indexOf(rucksack[0][i]) !== -1) {
            duplicates.add(rucksack[0][i]);
        }
    }
    return Array.from(duplicates);
}

const getCharactersScore = (characters: string[]): number => {
    return characters.reduce((value: number, char: string): number => {
        let score = alphabet.indexOf(char) + 1;
        if(score === 0) score = alphabet.toUpperCase().indexOf(char) + 27; 
        return value + score;
    }, 0)
}

const findBadges = ([elf1, elf2, elf3]: [string, string, string]): string[] => {
    const duplicates = new Set<string>();
    for (let i = 0; i < elf1.length; i ++) {
        if (elf2.indexOf(elf1[i]) !== -1 && elf3.indexOf(elf1[i]) !== -1) {
            duplicates.add(elf1[i]);
        }
    }
    return Array.from(duplicates);
} 
  
const parseData = (data: string): string[] => data.split(EOL);

module.exports = (rawData: string) => {
    const rucksacks = parseData(rawData);

    const score = rucksacks.reduce((value: number, rucksack: string): number => {
        const compartments = splitStringInMiddle(rucksack);
        const duplicates = getCommonCharacters(compartments);
        return value + getCharactersScore(duplicates);
    }, 0);

    console.log('1.', score)

    const groups = groupByN(3, rucksacks) as [string, string, string][];
    const score2 = groups.reduce((value: number, group: [string, string, string]): number => {
        const badges = findBadges(group);
        return value + getCharactersScore(badges);
    }, 0)

    console.log('2.', score2)
}

export {};