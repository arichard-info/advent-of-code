class Scanner {
    constructor(id, points = [], locked = false, direction = null) {
        this.id = id;
        this.points = points;
        this.locked = locked;
        this.direction = direction;
        this.position = [0,0,0];
    }

    tryToAlign(testScanner) {
        const currentPoints = this.points.map(p => getPointRotations(p)[this.direction])
        for(let dir=0;dir<24;dir++) {
            const points = testScanner.points.map(p => getPointRotations(p)[dir]);
            for(let indexPA=0;indexPA<points.length;indexPA++) {

                const pointA = points[indexPA];
                for(let indexP=0;indexP<currentPoints.length;indexP++) {
                
                    const currentPoint = currentPoints[indexP];
                    const subPoint = [currentPoint[0]-pointA[0], currentPoint[1]-pointA[1], currentPoint[2]-pointA[2]];

                    let overflow = 0;
                    for(let indexPB=0;indexPB<points.length;indexPB++) {

      
                        const pointB = points[indexPB];
                        const compareTo = [pointB[0]+subPoint[0], pointB[1]+subPoint[1], pointB[2]+subPoint[2]];

                        for(let indexP1=0;indexP1<currentPoints.length;indexP1++) {
  
                            const currentPoint1 = currentPoints[indexP1];
                            if(currentPoint1[0] === compareTo[0] && currentPoint1[1] === compareTo[1] && currentPoint1[2] === compareTo[2]) {
                                overflow++;
                            }

                            if(overflow === 12) {
                                testScanner.position = [subPoint[0] + this.position[0], subPoint[1] + this.position[1], subPoint[2] + this.position[2]];
                                testScanner.locked = true;
                                testScanner.direction = dir;
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
}

const getPointRotations = ([x,y,z]) => ([
    [x, y, z],
    [x, z, -y],
    [x, -y, -z],
    [x, -z, y],
    [-x, -y, z],
    [-x, z, y],
    [-x, y, -z],
    [-x, -z, -y],
    [y, -x, z],
    [y, z, x],
    [y, x, -z],
    [y, -z, -x],
    [-y, x, z],
    [-y, z, -x],
    [-y, -x, -z],
    [-y, -z, x],
    [z, x, y],
    [z, y, -x],
    [z, -x, -y],
    [z, -y, x],
    [-z, -x, y],
    [-z, y, x],
    [-z, x, -y],
    [-z, -y, -x],
])

const parseData = (data) => {
    return data.split('\n\n').map((rawScanner, index) => {
        const [rawScannerId, ...beacons] = rawScanner.split('\n');
        const scannerId = Number(rawScannerId.match(/[0-9]+/gm)[0]);

        const scanner = new Scanner(
            scannerId, 
            beacons.map(b => b.split(',').map(Number)),
            index === 0,
            index === 0 ? 0 : -1
        );

        return scanner;
    })
}

const resolveScannerPositions = (scanners) => {
    const [first, ...unlocked] = scanners;
    const locked = [first]

    while(unlocked.length) {
        const unlockedScanner = unlocked.pop();
        let found = false;
        for(let index=0;index<locked.length;index++){
            const lockedScanner = locked[index];
            if(lockedScanner.tryToAlign(unlockedScanner)) {
                found = true;
                locked.unshift(unlockedScanner);
                break;
            }
        }
        if(!found) {
            unlocked.unshift(unlockedScanner);
        }
    }
    return locked;
}

const countCommonBeacons = (scanners) => {
    const beacons = new Set();

    scanners.forEach(scanner => {
        scanner.points.forEach(p => {
            const point = getPointRotations(p)[scanner.direction]
            const pos = [ point[0] + scanner.position[0], point[1] + scanner.position[1], point[2] + scanner.position[2]];
            beacons.add(pos.join(','));
        })
    })

    return beacons.size;
}

const calcDistance = (posA, posB) => {
    return Math.abs(posB[0] - posA[0]) + Math.abs(posB[1]-posA[1]) + Math.abs(posB[2]-posA[2])
}

const getMaxDistance = (scanners) => {
    let max = 0;
    scanners.forEach(scannerA => {
        scanners.forEach(scannerB => {
            if(scannerA.id !== scannerB.id) {
                const distance = calcDistance(scannerA.position, scannerB.position);
                if(distance > max) max = distance;
            }
        })
    });
    return max;
}

module.exports = (rawData) => {
    const scannersToResolve = parseData(rawData);
    const scanners = resolveScannerPositions(scannersToResolve);
    const count = countCommonBeacons(scanners);
    console.log('1.', count)
    const maxDistance = getMaxDistance(scanners);
    console.log('2.', maxDistance)
}