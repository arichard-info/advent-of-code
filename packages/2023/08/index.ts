const { EOL } = require('os');
const { ppcm } = require('commons/lib/ppcm');

type Node = {
    key: string;
    L: string;
    R: string;
};

const parseData = (data: string): { instructions: string; nodes: { [key: string]: Node } } => {
    const [instructions, rawNodes] = data.split(EOL + EOL);
    const nodes: { [key: string]: Node } = {};
    rawNodes.split(EOL).forEach((rawNode) => {
        const [node, L, R] = rawNode.match(/([1-9A-Z]{3})/g) as string[];
        nodes[node] = { R, L, key: node };
    });

    return {
        instructions,
        nodes,
    };
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    let node = 'AAA';
    let index = 0;
    if (data.nodes[node]) {
        while (node !== 'ZZZ' && index < 100000) {
            const instruction = data.instructions[index % data.instructions.length];
            node = (data.nodes[node] as { [key: string]: string })[instruction];
            index++;
        }
    }

    console.log('1.', index);

    let nodes = Object.keys(data.nodes).filter((key) => key.endsWith('A'));
    let patterns = new Array(nodes.length)
        .fill(null)
        .map((): { start: number | null; loop: number | null } => ({
            start: null,
            loop: null,
        }));

    index = 0;
    while (patterns.some((p) => p.loop === null) && index < 200000) {
        const instruction = data.instructions[index % data.instructions.length];
        nodes = nodes.map((node, nodeIndex) => {
            const newNode = (data.nodes[node] as { [key: string]: string })[instruction];

            if (newNode.endsWith('Z')) {
                if (patterns[nodeIndex].start !== null && patterns[nodeIndex].loop === null) {
                    patterns[nodeIndex].loop = index - (patterns[nodeIndex].start as number);
                } else {
                    patterns[nodeIndex].start = index;
                }
            }
            return newNode;
        });
        index++;
    }

    console.log('2.', ppcm(...patterns.map((p) => p.loop)));
};

export {};
