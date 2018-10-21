// @flow

import objHasKey from '../../../../lib/objHasKey';

export type XformValues = {
    rotate?: string,
};

const REGEX_MAPPER = {
    rotate: /rotate\([-\d\s.]*\)/,
};

export function getNextXform(
    curXform: string,
    nextXformValues: XformValues,
): string {
    return Object.keys(nextXformValues).reduce((xformStr, nextXformKey) => {
        xformStr.replace(
            REGEX_MAPPER[nextXformKey],
            nextXformValues[nextXformKey],
        );
        return xformStr
    }, curXform);
}

export function getCurXformVals(
    curXform: string,
    xformKeys: string[],
): XformValues {
    return xformKeys.reduce((acc, curVal) => {
        if (objHasKey(REGEX_MAPPER, curVal)) {
            const s = curXform.match(REGEX_MAPPER[curVal]);
            if (s) {
                acc[curVal] = s.match(/[\d-.\s]+/g)[0];
            } else {
                acc[curVal] = '0'
            }
        }
        return acc
    }, {})
}
