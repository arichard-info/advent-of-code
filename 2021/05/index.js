const parseData = (data) => {
  return data.split('\n').map(row => {
    const [start, end] = row.split(' -> ');
    return [start.split(',').map(Number), end.split(',').map(Number)];
  })
}

const getVentCoordinates = ([[x1, y1], [x2, y2]], diagonal = false) => {
  if (x1 === x2) {
    const start = y1 < y2 ? y1 : y2;
    const length = Math.abs(y1 - y2) + 1;
    return Array.from({ length }, (_, i) => `${x1},${start + i}`);
  } else if (y1 === y2) {
    const start = x1 < x2 ? x1 : x2;
    const length = Math.abs(x1 - x2) + 1;
    return Array.from({ length }, (_, i) => `${start + i},${y1}`);
  } else if (diagonal) {
    const length = Math.abs(x1 - x2) + 1;
    const xChange = (x1 - x2) / Math.abs(x1 - x2);
    const yChange = (y1 - y2) / Math.abs(y1 - y2);
    return Array.from(
      { length },
      (_, i) => `${x1 - xChange * i},${y1 - yChange * i}`
    );
  } else return [];
}

const getCoordOccurences = (data, diagonal) => {
  const obj = {};
  for (const lineSegment of data) {
    getVentCoordinates(lineSegment, diagonal).forEach((coord) => {
      if (obj[coord]) {
        obj[coord] += 1;
      } else {
        obj[coord] = 1;
      }
    });
  }
  return obj;
}

const countOverlap = (occurences) => Object.values(occurences).filter(v => v > 1).length;


module.exports = (rawData) => {
  const data = parseData(rawData)

  const basicOccurences = getCoordOccurences(data);
  const basicOverlaps = countOverlap(basicOccurences);
  console.log("1.", basicOverlaps);

  const diagOccurences = getCoordOccurences(data, true);
  const diagOverlaps = countOverlap(diagOccurences);
  console.log("2.", diagOverlaps);
}