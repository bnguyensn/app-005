// @flow

import {colNumToColName} from './utils';
import {isArrayEqual} from '../../lib/array';

export type ValidationData = any;

export type ValidationFns = (data: ValidationData) => string;

/** ********** HELPERS ********** **/

function getEmptyArrayIndices(
    arr: any[],
    reportAll: boolean,
    errCountLimit: number,
): number[] {
    const adjErrCountLimit = errCountLimit < 1 ? 1 : errCountLimit;

    const emptyIndices = [];

    if (reportAll) {
        let errCount = 0;
        let i = 0;
        while (i < arr.length && errCount < adjErrCountLimit) {
            if (!(i in arr)) {
                emptyIndices.push(i);
                errCount += 1;
            }
            i += 1;
        }
    } else {
        let i = 0;
        while (i < arr.length) {
            if (!(i in arr)) {
                emptyIndices.push(i);
                break;
            }
            i += 1;
        }
    }

    return emptyIndices
}

function enforceRangeOnNumber(n: number,
                              range: {min: number, max: number}): number {
    if (n < range.min) {
        return range.min
    }
    if (n > range.max) {
        return range.max
    }
    return n
}

/** ********** VALIDATION GROUPS - SHEET ********** **/

export const SHEET_SHAPE: ValidationFns[] = [
    (data: {rowsCount: number, colsCount: number}): string => {
        const {rowsCount, colsCount} = data;

        return rowsCount < 3 || colsCount < 3
            ? 'Must have at least 3 rows and 3 columns.'
            : ''
    },
    (data: {rowsCount: number, colsCount: number}): string => {
        const {rowsCount, colsCount} = data;

        return rowsCount !== colsCount
            ? 'Number of rows must be equal to number of columns.'
            : ''
    },
];

export const NAMES_ROW: ValidationData[] = [
    (data: {
        value: string,
        rowIndex: number,
        colIndex: number,
        values: string[],
    }): string => {
        const {value, rowIndex, colIndex, values} = data;

        return values.includes(value)
            ? `Name ${value} at cell `
            + `${colNumToColName(colIndex)}${rowIndex + 1} `
            + 'is duplicated.'
            : ''
    },
];

export const NAMES_COL: ValidationFns[] = [
    (data: {
        value: string,
        rowIndex: number,
        colIndex: number,
        values: string[],
    }): string => {
        const {value, rowIndex, colIndex, values} = data;

        return values.includes(value)
            ? `Name ${value} at cell `
            + `${colNumToColName(colIndex)}${rowIndex + 1} `
            + 'is duplicated.'
            : ''
    },
];

export const SHEET_AMOUNT: ValidationData[] = [
    (data: {
        value: string | number,
        rowIndex: number,
        colIndex: number,
    }): string => {
        const {value, rowIndex, colIndex} = data;

        if (value === '' || value === undefined) {
            return ''
        }

        const intAmount = parseInt(value, 10);

        if (typeof intAmount !== 'number' || Number.isNaN(intAmount)) {
            return `Amount '${value}' at cell `
                + `${colNumToColName(colIndex)}${rowIndex + 1} is not numeric.`
        }

        if (Number(value) < 0) {
            return `Amount '${value}' at cell `
                + `${colNumToColName(colIndex)}${rowIndex + 1} is less than 0. `
                + 'All amounts must be larger than 0.'
        }

        return ''
    },
];

export const NAMES_ROW_COL: ValidationFns[] = [
    (data: {
        namesRow: string[],
        namesCol: string[],
    }): string => {
        const {namesRow, namesCol} = data;

        return !isArrayEqual(namesRow, namesCol)
            ? 'Names in header row and names in header column do not match. '
            + 'Please make sure data in sheet is symmetrical.'
            : ''
    },
];
