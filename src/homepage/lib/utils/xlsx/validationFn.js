// @flow

import {colNumToColName} from './utils';

export type ValidationData = any;

export type ValidationFn = (data: ValidationData) => string;

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

/** ********** VALIDATION GROUPS - FUND SHEET ********** **/

/*export const FUND_SHEET_: ValidationData[] = [
    (data: ): string => (

    ),
];*/

export const FUND_SHEET_ROWS_COUNT: ValidationFn[] = [
    (data: number): string => (
        data < 2
            ? 'Provided fund sheet either does not have any data, or does '
            + 'not have a header. '
            + 'Please revise fund sheet to match our specifications.'
            : ''
    ),
];

export const FUND_SHEET_COLS_COUNT: ValidationFn[] = [
    (data: number): string => (
        data < 5
            ? 'Provided fund sheet does not have enough data columns. '
            + 'Please revise fund sheet to match our specification.'
            : ''
    ),
];

export const FUND_SHEET_HEADER: ValidationFn[] = [
    (data: {header: string, colIndex: number, headers: string[]}): string => (
        data.headers.includes(data.header)
            ? `Fund sheet header at cell ${colNumToColName(data.colIndex)}1 `
            + 'is duplicated.'
            : ''
    ),
];

export const FUND_SHEET_FUND_NAME: ValidationData[] = [
    (data: {
        fundName: string,
        rowIndex: number,
        colIndex: number,
        fundData: any[],
    }): string => (
        !('0' in data.fundData) || !data.fundData[data.colIndex]
            ? 'Fund name at cell '
            + `${colNumToColName(data.colIndex)}${data.rowIndex + 1} `
            + 'is blank.'
            : ''
    ),

    (data: {
        fundName: string,
        rowIndex: number,
        colIndex: number,
        fundNames: any[],
    }): string => (
        data.fundName && data.fundNames.includes(data.fundName)
            ? 'Fund name at cell '
            + `${colNumToColName(data.colIndex)}${data.rowIndex + 1} `
            + 'is duplicated.'
            : ''
    ),
];

export const FUND_SHEET_AMOUNT: ValidationData[] = [
    (data: {
        amount: string | number,
        rowIndex: number,
        colIndex: number,
    }): string => {
        const {amount, rowIndex, colIndex} = data;

        if (amount === '' || amount === undefined) {
            return ''
        }

        const intAmount = parseInt(amount, 10);

        if (typeof intAmount !== 'number' || Number.isNaN(intAmount)) {
            return `Fund data '${amount}' at cell `
                + `${colNumToColName(colIndex)}${rowIndex + 1} is not numeric.`
        }

        if (intAmount < 0) {
            return `Fund data '${amount}' at cell `
                + `${colNumToColName(colIndex)}${rowIndex + 1} is less than 0.`
        }

        return ''
    },
];

/** ********** VALIDATION GROUPS - ASSET SHEET ********** **/

export const ASSET_SHEET_ASSET_NAME: ValidationData[] = [
    // Check blank names
    (data: {
        assetName: string,
        rowIndex: number,
        colIndex: number,
        assetData: any[],
    }): string => (
        !('0' in data.assetData) || !data.assetData[data.colIndex]
            ? 'Asset name at cell '
            + `${colNumToColName(data.colIndex)}${data.rowIndex + 1} `
            + 'is blank.'
            : ''
    ),

    // Check duplicate names
    (data: {
        assetName: string,
        rowIndex: number,
        colIndex: number,
        assetNames: any[],
    }): string => (
        data.assetName && data.assetNames.includes(data.assetName)
            ? 'Asset name at cell '
            + `${colNumToColName(data.colIndex)}${data.rowIndex + 1} `
            + 'is duplicated.'
            : ''
    ),
];

export const ASSET_SHEET_ASSET_LEVEL: ValidationData[] = [
    // Check NaN, non-integer, < 1 amounts
    (data: {
        amount: string | number,
        rowIndex: number,
        colIndex: number,
    }): string => {
        const {amount, rowIndex, colIndex} = data;

        if (amount === '' || amount === undefined) {
            return ''
        }

        const intAmount = parseInt(amount, 10);
        if (typeof intAmount !== 'number' || Number.isNaN(intAmount)) {
            return `Asset level '${amount} at cell `
                + `${colNumToColName(colIndex)}${rowIndex + 1} is not numeric.`
        }

        if (!Number.isInteger(Number(amount))) {
            return `Asset level '${amount} at cell `
                + `${colNumToColName(colIndex)}${rowIndex + 1} is non-integer.`
        }

        if (intAmount < 1) {
            return `Asset data '${amount}' at cell `
                + `${colNumToColName(colIndex)}${rowIndex + 1} is less than 1.`
        }

        return ''
    },
];

export const ASSET_SHEET_ASSET_WEIGHTING: ValidationData[] = [
    // Check NaN, < 0 amounts
    (data: {
        amount: string | number,
        rowIndex: number,
        colIndex: number,
    }): string => {
        const {amount, rowIndex, colIndex} = data;

        if (amount === '' || amount === undefined) {
            return ''
        }

        const intAmount = parseInt(amount, 10);
        if (typeof intAmount !== 'number' || Number.isNaN(intAmount)) {
            return `Asset weighting '${amount} at cell `
                + `${colNumToColName(colIndex)}${rowIndex + 1} is not numeric.`
        }

        if (intAmount < 0 || intAmount > 1) {
            return `Asset weighting '${amount}' at cell `
                + `${colNumToColName(colIndex)}${rowIndex + 1} is not between `
                + '0 and 1.'
        }

        return ''
    },
];
