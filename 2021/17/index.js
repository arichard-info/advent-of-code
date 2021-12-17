const parseData = (data) => {
    const rawCoords = data.split(': ')[1].replace(/.=/gm, '').split(',');
    return {
        x: rawCoords[0].split('..').map(Number),
        y: rawCoords[1].split('..').map(Number)
    }
}

const launchProbe = (velocity, target) => {
    let [Vx, Vy] = velocity;
    let x = 0;
    let y = 0;
    let maxY;

    while(x < target.x[1] && y > target.y[0]) {
        x+=Vx;
        y+=Vy;
        if(!maxY || y > maxY) maxY = y;

        if(Vx > 0) Vx--;
        if(Vx < 0) Vx++;
        Vy--;

        if(x <= target.x[1] && x >= target.x[0] && y <= target.y[1] && y >= target.y[0]) return maxY;
    }
    return false;
}

const launchMultipleProbes = (attempts, target) => {
    let max = 0;
    let count = 0;

    for(let x=0;x<=attempts; x++){
        for(let y=-attempts;y<=attempts; y++) {
            const res = launchProbe([x, y], target);
            if(res !== false) {
                // console.log([x, y]);
                count++;
                if(res > max) max = res;
            }
        }
    }

    return { max, count }
}

module.exports = (rawData) => {
    const target = parseData(rawData);
    const { max, count } = launchMultipleProbes(1000, target)

    console.log('1.', max);
    console.log('2.', count);

}