const { EOL } = require('os');

interface Instruction {
    type: 'addx' | 'noop';
    value?: number;
}

const parseData = (data: string): Instruction[] =>
    data.split(EOL).map((row: string) => {
        const [type, value] = row.split(' ');
        if (type === 'addx') return { type, value: +value };
        return { type: 'noop' };
    });

const countSignalStrenght = (instructions: Instruction[]): number => {
    let X = 1;
    let clock = 1;
    let signalsSum = 0;
    instructions.forEach((instruction) => {
        clock += 1;
        if ((clock - 20) % 40 === 0) signalsSum += clock * X;

        if (instruction.type === 'addx') {
            clock += 1;
            if (instruction.value) X = X + instruction.value;
            if ((clock - 20) % 40 === 0) signalsSum += clock * X;
        }
    });
    return signalsSum;
};

const drawPixel = (position: number, spriteIndex: number) => {
    if (position % 40 <= spriteIndex + 1 && position % 40 >= spriteIndex - 1) return '#';
    return ' ';
};

const drawImage = (instructions: Instruction[]): string => {
    let pixelStr = '';
    let X = 1;
    let clock = 0;
    instructions.forEach((instruction) => {
        pixelStr += drawPixel(clock, X);
        clock += 1;
        if (instruction.type === 'addx') {
            pixelStr += drawPixel(clock, X);
            clock += 1;
            if (instruction.value) X = X + instruction.value;
        }
    });

    return pixelStr.replace(/.{40}/g, '$&\n');
};

module.exports = (rawData: string) => {
    const instructions = parseData(rawData);

    console.log('1.', countSignalStrenght(instructions));
    console.log('2.');
    console.log(drawImage(instructions));

    // ###  #  #  ##  #  # #  # ###  #### #  #
    // #  # #  # #  # # #  #  # #  # #    # #
    // #  # #  # #  # ##   #### ###  ###  ##
    // ###  #  # #### # #  #  # #  # #    # #
    // # #  #  # #  # # #  #  # #  # #    # #
    // #  #  ##  #  # #  # #  # ###  #### #  #
};

export {};
