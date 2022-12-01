const { EOL } = require('os');

const parseData = data => data.split(EOL).map(entry => {
    const [instruction, value] = entry.split(' ');
    return { [instruction]: Number(value) }
})

module.exports = (rawData) => {
    const instructions = parseData(rawData);

    const res = instructions.reduce((position, instruction) => {
        if(instruction.down) position.depth += instruction.down;
        if(instruction.up) position.depth -= instruction.up;
        if(instruction.forward) position.dist += instruction.forward;
        return position;
    }, {depth: 0, dist: 0})
    
    console.log('1.', res.depth * res.dist);
    
    const res2 = instructions.reduce((position, instruction) => {
        if(instruction.down) position.aim += instruction.down;
        if(instruction.up) position.aim -= instruction.up;
        if(instruction.forward) { 
            position.dist += instruction.forward;
            position.depth += (position.aim * instruction.forward)
        }
        return position;
    }, {depth: 0, dist: 0, aim: 0 })
    
    console.log('2.', res2.depth * res2.dist);
}

