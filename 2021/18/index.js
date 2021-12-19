const parseData = (data) => {
    return data.split('\n').map(row => JSON.parse(row))
}

const sumAllNumbers = (numbers) => {
    return numbers.reduce((finalNumber, currentNumber) => {
        const sum = reduceNumber([finalNumber, currentNumber]);
        return sum;
    }, [])
}


const reduceNumber = (pair) => {

    pair.forEach(pair1 => {
        if(Array.isArray(pair1)) {
            pair1.forEach(pair2 => {
                if(Array.isArray(pair2)) {
                  pair2.forEach(pair3 => {
                    if(Array.isArray(pair3)) {
                        if(pair3.some(c => Array.isArray(c))) {
                            console.log('////', pair3)
                        }
                    }
                  })
                   
                }
            })
        }
    })
    // while(true) {
    // const needExplode = number.findIndex(el => getArrayDepth(el) >= 4);
    // console.log("///", elementToExplode)

    // }
}

module.exports = (rawData) => {
    const data = parseData(rawData);
    // const res = sumAllNumbers([...data[0], data[1]]);
    reduceNumber([[[[[9,8],1],2],3],4]);

}