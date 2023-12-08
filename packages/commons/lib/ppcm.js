export const ppcm = (...values) => {
    const _pgcd = (a, b) => {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    };

    const _ppcm = (a, b) => {
        return (a * b) / _pgcd(a, b);
    };

    let ppcm = values[0];

    for (let i = 1; i < values.length; i++) {
        ppcm = _ppcm(ppcm, values[i]);
    }

    return ppcm;
};
