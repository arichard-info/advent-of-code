const findStartOfPacket = (str: string, markerLength: number): number => {
    for (let i = 0; i < str.length; i++) {
        if (new Set(str.slice(i, i + markerLength)).size === markerLength) {
            return i + markerLength;
        }
    }
    return str.length - 1;
};

module.exports = (rawData: string) => {
    const res1 = findStartOfPacket(rawData, 4);
    console.log('1.', res1);

    const res2 = findStartOfPacket(rawData, 14);
    console.log('2.', res2);
};

export {};
