const parseData = (data) => {
    const [lineAlgorithm, rawPicture] = data.split('\n\n');
    return {
        lineAlgorithm,
        picture: rawPicture.split('\n').map(row => row.split(''))
    }
}

const coord = [[[-1, -1], [-1, 0], [-1, 1]],  [[0, -1], [0, 0], [0, 1]], [[1, -1], [1, 0], [1, 1]] ];

const enhancePicture = algorithm => (picture, attempt) => {
    const newPicture = [];
    for (let y = -1; y < picture.length + 1; y++) {
        for (let x = -1; x < picture[0].length + 1; x++) {
            const binaryCode = coord.reduce((code, squareRow) => {
                let rowCode = "";
                squareRow.forEach(pos => {
                    if(picture[y+pos[0]]?.[x+pos[1]] === "#") rowCode += "1"
                    else if(picture[y+pos[0]]?.[x+pos[1]] === ".")  rowCode += "0"
                    else if(attempt % 2) rowCode += "1"
                    else rowCode += '0'
                })
                return code + rowCode;
            }, "");
            const index = parseInt(binaryCode, 2);
            if(!newPicture[y+1]) newPicture[y+1] = [];
            newPicture[y+1][x+1] = algorithm[index];
        }
    }
    return newPicture;
}

const countLitPixels = (image) => {
    return image.reduce((count, row) => {
        const rowCount = row.filter(c => c === "#").length;
        return count + rowCount;
    }, 0)
}

const successiveEnhancement = (algorithm, picture, steps)=> {
    const enhancer = enhancePicture(algorithm);;
    for(let i=0;i<steps;i++) {
        picture = enhancer(picture, i);
    }
    return picture;
}

module.exports = (rawData) => {
    const {picture, lineAlgorithm} = parseData(rawData);

    const finalPicture = successiveEnhancement(lineAlgorithm, picture, 2)
    const res = countLitPixels(finalPicture);
    console.log("1.", res)

    const finalPicture2 = successiveEnhancement(lineAlgorithm, picture, 50)
    const res2 = countLitPixels(finalPicture2);
    console.log("2.", res2)
}