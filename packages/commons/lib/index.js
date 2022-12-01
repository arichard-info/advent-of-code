/**
 * Deep clone object or array
 * @param {*} value 
 * @returns 
 */
const deepClone = (value) => {
    return JSON.parse(JSON.stringify(value))
}

module.exports = {
    deepClone
}