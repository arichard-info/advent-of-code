const parseData = (data) => data.split('\n').map(row => castToNumber(JSON.parse(row)));

const castToNumber = (value) => {
    if(Array.isArray(value)) return value.map(castToNumber);
    return Number(value);
}

const sumAllNumbers = (numbers) => {
    const data = JSON.parse(JSON.stringify(numbers));
    return data.slice(1).reduce((finalNumber, currentNumber) => {
        const sum = reduceNumber([finalNumber, currentNumber]);
        return sum;
    }, data[0])
}

const reduceNumber = (number) => {
    let needReduce = false;
    do {
        needReduce = false;
        const explodedNumber = explodeNumber(number);
        if(explodedNumber) {
            number = explodedNumber
            needReduce = true;
            continue;
        }

        const splittedNumber = splitNumber(number);
        if(splittedNumber) {
            number = splittedNumber;
            needReduce = true;
            continue;
        }
    } while(needReduce);
    return number;
}

const splitNumber = (number) => {
    for(let i1=0;i1<number.length;i1++) {
        if(Array.isArray(number[i1])) {
            for(let i2=0;i2<number[i1].length;i2++){
                if(Array.isArray(number[i1][i2])){
                    for(let i3=0;i3<number[i1][i2].length;i3++){
                        if(Array.isArray(number[i1][i2][i3])) {
                            for(let i4=0;i4<number[i1][i2][i3].length;i4++) {
                                if(!Array.isArray(number[i1][i2][i3][i4]) && number[i1][i2][i3][i4] > 9) {
                                    number[i1][i2][i3][i4] = calcSplitNumber(number[i1][i2][i3][i4]);
                                    return number;
                                }
                            }
                        } else if (number[i1][i2][i3] > 9) {
                            number[i1][i2][i3] = calcSplitNumber(number[i1][i2][i3]);
                            return number;
                        }
                    }
                } else {
                    if(number[i1][i2] > 9) {
                    number[i1][i2] = calcSplitNumber(number[i1][i2]);
                    return number;
                }}
            }
        } else if(number[i1] > 9) {
            number[i1] = calcSplitNumber(number[i1]);
            return number;
        }
    }
}

const calcSplitNumber = (value) => ([Math.floor(value / 2), Math.ceil(value / 2)]);

const explodeNumber = (number) => {
    for(let i1=0;i1<number.length;i1++) {
        if(Array.isArray(number[i1])) {
            for(let i2=0;i2<number[i1].length;i2++){
                if(Array.isArray(number[i1][i2])){
                    for(let i3=0;i3<number[i1][i2].length;i3++){
                        if(Array.isArray(number[i1][i2][i3])){
                            const pairIndex = number[i1][i2][i3].findIndex(Array.isArray);
                            if(pairIndex!==-1) {
                                const pairToExplode = number[i1][i2][i3][pairIndex]

                                if(pairIndex === 0) {
                                    if(Array.isArray(number[i1][i2][i3][1])) number[i1][i2][i3][1][0] += pairToExplode[1];
                                    else number[i1][i2][i3][1] += pairToExplode[1];
                                    number[i1][i2][i3][0] = 0;
                                    if(i3===1) {
                                        if(Array.isArray(number[i1][i2][0])) number[i1][i2][0][1] += pairToExplode[0];
                                        else number[i1][i2][0] += pairToExplode[0];
                                        return number
                                    }
                                    if(i2===1) {
                                        if(Array.isArray(number[i1][0])){
                                            if(Array.isArray(number[i1][0][1])) number[i1][0][1][1] += pairToExplode[0];
                                            else number[i1][0][1] += pairToExplode[0]
                                        } else number[i1][0] += pairToExplode[0];
                                        return number;
                                    }
                                    if(i1===1) {
                                        if(Array.isArray(number[0])){
                                            if(Array.isArray(number[0][1])) {
                                                if(Array.isArray(number[0][1][1])) number[0][1][1][1] += pairToExplode[0];
                                                else number[0][1][1] += pairToExplode[0]; 
                                            } else number[0][1] += pairToExplode[0]
                                        } else number[0] += pairToExplode[0];
                                        return number;
                                    }
                                } else if (pairIndex === 1) {
                                    
            
                                    number[i1][i2][i3][0] += pairToExplode[0];
                                    number[i1][i2][i3][1] = 0;

                                    if(i3===0) {
                                        if(Array.isArray(number[i1][i2][1])) {
                                            if(Array.isArray(number[i1][i2][1][0])) number[i1][i2][1][0][0] += pairToExplode[1];
                                            else number[i1][i2][1][0] += pairToExplode[1];
                                        }
                                        else number[i1][i2][1] += pairToExplode[1];
                                        return number
                                    }
                                    if(i2===0) {
                                        if(Array.isArray(number[i1][1])){
                                            if(Array.isArray(number[i1][1][0])) {
                                                if(Array.isArray(number[i1][1][0][0])) number[i1][1][0][0][0] += pairToExplode[1];
                                                else number[i1][1][0][0] += pairToExplode[1];
                                            } else number[i1][1][0] += pairToExplode[1]
                                        } else number[i1][1] += pairToExplode[1];
                                        return number;
                                    }
                                    if(i1===0) {
                                        if(Array.isArray(number[1])){
                                            if(Array.isArray(number[1][0])) {
                                                if(Array.isArray(number[1][0][0])) {
                                                    if(Array.isArray(number[1][0][0][0])) number[1][0][0][0][0] += pairToExplode[1];
                                                    else number[1][0][0][0] += pairToExplode[1];
                                                }
                                                else number[1][0][0] += pairToExplode[1]; 
                                            } else number[1][0] += pairToExplode[1]
                                        } else number[1] += pairToExplode[1];
                                        return number;
                                    }
                                }
                                return number;
                            }
                        }
                    }
                }
            }
        }
    }
}

const calcMagniture = num => Number.isInteger(num) ? num : 3 * calcMagniture(num[0]) + 2 * calcMagniture(num[1])

const findGreatestMagnitude = (numbers) => {
    let max = 0;
    numbers.forEach((firstNumber, firstIndex) => {
        numbers.forEach((secondNumber, secondIndex) => {
            if(firstIndex !== secondIndex) {
                const firstCalcNumber = sumAllNumbers([firstNumber, secondNumber])
                const secondCalcNumber = sumAllNumbers([secondNumber, firstNumber])
                const res = Math.max(calcMagniture(firstCalcNumber), calcMagniture(secondCalcNumber))
                if(res > max) max = res;
            }
        })
    })
    return max;
}

module.exports = (rawData) => {
    const data = parseData(rawData);
    
    const finalSum = sumAllNumbers(data);
    const magnitude = calcMagniture(finalSum);
    console.log('1.', magnitude);

    const greatestMagniture = findGreatestMagnitude(data);
    console.log('2.', greatestMagniture);
}