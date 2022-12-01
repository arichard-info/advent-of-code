const { EOL } = require('os');

const parseData = (data) => {
    const [template, rawPairs] = data.split(EOL + EOL);
    const pairs = rawPairs.split(EOL).reduce((pairObject, pair) => {
        const [key, value] = pair.split(' -> ');
        pairObject[key] = value;
        return pairObject;
    }, {});
    return {
        pairs,
        template: template.split('')
    }
}

const insertAt = (arr, index, element) => {
    const resArr = [...arr]
    resArr.splice(index, 0, element).join('');
    return resArr;
}

const insertCharacters = (template, pairs) => {
    let newArr = [...template];
    for(let i=0;i<template.length;i++) {
        const insertIndex = (i * 2) + 1;
        if(template[i+1]) {
            const bounds = `${template[i]}${template[i+1]}`;
            const valueToInsert = pairs[bounds];
            newArr = insertAt(newArr, insertIndex, valueToInsert);
        }
    }
    return newArr;
}

const getFullString = (template, pairs, duration) => {
    for(let d=0;d<duration;d++){
        template = insertCharacters(template, pairs);
    }
    return template;
}

const getOccurences = arr => {
    const counts = arr.reduce((obj, char) => {
        if(obj[char]) obj[char]++;
        else obj[char] = 1;
        return obj;
    }, {})

    return { 
        min: Object.values(counts).reduce((value, v) => v < value ? v : value),
        max: Object.values(counts).reduce((value, v) => v > value ? v : value)
    }
}

const getOccurencesFromPairs = (pairs, template) => {
    const counts = Object.entries(pairs).reduce((letters, [pair, count]) => {
        const [l, r] = pair;
        if(letters[l] === undefined) letters[l] = 0;
        if(letters[r] === undefined) letters[r] = 0;
        letters[l] += count;
        letters[r] += count;
        return letters;
    }, {})

    counts[template[0]] += 1;
    counts[template[template.length -1]] += 1;

    return { 
        min: Object.values(counts).reduce((value, v) => v < value ? v : value),
        max: Object.values(counts).reduce((value, v) => v > value ? v : value)
    }
}

const getPairsCount = (template, pairs, steps) => {
    let pairCount = {};
    for (let i = 0; i < template.length - 1; i++) {
      const pair = `${template[i]}${template[i+1]}`
      if (pairCount[pair] === undefined) pairCount[pair] = 0;
      pairCount[pair] += 1;
    }

    for (let i = 0; i < steps; i++) {
        const newPairCount = {};
        Object.entries(pairCount).forEach(([pair, count]) => {
          // Get the current rule
          const rule = pairs[pair]
          // Generate the new pairs
          let [l, r] = pair.split('')
          l = l + rule
          r = rule + r
          if (newPairCount[l] === undefined) {
            newPairCount[l] = 0
          }

          if (newPairCount[r] === undefined) {
            newPairCount[r] = 0
          }
          newPairCount[l] = newPairCount[l] + count
          newPairCount[r] = newPairCount[r] + count
        })
        pairCount = newPairCount
      }

      return pairCount
}

module.exports = (rawData) => {
    const { pairs, template } = parseData(rawData);
    const res = getFullString(template, pairs, 10);
    const { min, max } = getOccurences(res);
    console.log('1.', max-min);

    const res2 = getPairsCount(template, pairs, 40);
    const { min: min2, max: max2 } = getOccurencesFromPairs(res2, template);
    console.log('2.', (max2-min2)/2)
}