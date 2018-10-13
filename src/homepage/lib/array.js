export function recursiveFlat(acc, curVal) {
    if (Array.isArray(curVal)) {
        curVal.forEach((item) => {
            recursiveFlat(acc, item);
        });
    } else {
        acc.push(curVal);
    }
}

export function findMaxInArray(arr) {
    const flattenedArr = [];
    recursiveFlat(flattenedArr, arr);
    return Math.max(...flattenedArr)
}
