// @flow

import isObjEqual from './isObjEqual';
import isNumber from './isNumber';

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

export function findMinInArray(arr) {
    const flattenedArr = [];
    recursiveFlat(flattenedArr, arr);
    return Math.min(...flattenedArr)
}

export function isArrayEqual(a: any, b: any) {
    if (a && b) {
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;

            return a.every((aIt, index) => isArrayEqual(aIt, b[index]))
        }

        if ((typeof a === 'string' && typeof b === 'string')
            || (isNumber(a) && isNumber(b))
            || (typeof a === 'boolean' && typeof b === 'boolean')) {
            return a === b
        }
    }

    return isObjEqual(a, b)
}
