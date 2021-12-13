const parseData = (str) => str.split('\n').map(row => row.split('-'));

const isValidPath = (p, smallToleration = 1) => {
    const lower = p.filter(e => e === e.toLowerCase());
    return lower.length === (new Set(lower)).size || lower.length === (new Set(lower)).size + (smallToleration - 1)
}

const countPaths = (segments, smallToleration = 1) => {
    const paths = [];

    const drawPath = (path) => {
        const lastPosition = path[path.length-1];
        const possibleSegments = segments
            .filter(s => s.includes(lastPosition) && !s.includes('start'))

        possibleSegments.forEach(s => {
            if(s[0] !== lastPosition) [s[0], s[1]] = [s[1], s[0]];
            const newPath = [...path, s[1]];
            if(s[1] === "end") paths.push(newPath);
            else if(isValidPath(newPath, smallToleration)) drawPath(newPath);
        });
    };

    const statingSegments = segments.filter(s =>  s.includes("start")).map(s => s[1] === "start" ? s.reverse() : s);
    statingSegments.forEach(s => drawPath(s));

    return paths.length;
}

module.exports = (rawData) => {
    const data = parseData(rawData);
    const pathsCount = countPaths(data);
    console.log('1.', pathsCount);

    const pathsCount2 = countPaths(data, 2);
    console.log('2.', pathsCount2);
}