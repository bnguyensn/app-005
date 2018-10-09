/**
 * Validate data in the fund sheet
 * */

// @flow

import * as VALIDATION from './validationFn';

import type {ValidationData, ValidationFn} from './validationFn';

/** ********** CONFIGS ********** **/

// If true, will parse all data and return all found errors
const REPORT_ALL_ERRORS = true;

/** ********** HELPERS ********** **/

function addClosingErrorMsg(errMsgs: string[]) {
    errMsgs.push('There might be more issues, but the check stopped here.');
}

function addErrorMsg(errMsgs: string[], errMsg: string) {
    errMsgs.push(errMsg);
}

/**
 * Validate a single datum against one or more conditions and populate the
 * ERR_MSGS array at the same time
 * */
function validate(data: ValidationData, validationFns: ValidationFn[],
                  errMsgs: string[]): boolean {
    // Stop evaluating all conditions on the first false condition if we don't
    // want to report all errors

    if (!REPORT_ALL_ERRORS) {
        return validationFns.every((validationFn) => {
            const errMsg = validationFn(data);
            if (errMsg) {
                addErrorMsg(errMsgs, errMsg);
                addClosingErrorMsg(errMsgs);
            }
            return !errMsg
        })
    }

    // Evaluate all conditions before returning the final boolean if we want
    // to report all errors
    // The final boolean is only true if ALL conditions are true

    return validationFns.reduce((finalValid, validationFn) => {
        const errMsg = validationFn(data);
        if (errMsg) {
            addErrorMsg(errMsgs, errMsg);
        }
        return finalValid + !errMsg
    }, 0) === validationFns.length
}

export function validateFundSheetData(fundSheetData: any[]): string[] {
    // Store all error messages
    const errMsgs = [];

    /** ***** CHECK FUND SHEET EMPTINESS ***** **/
    /**
     * Should have at least 2 rows (1 header + 1 fund)
     * */

    if (!validate(fundSheetData.length, VALIDATION.FUND_SHEET_ROWS_COUNT,
        errMsgs)) {
        return errMsgs
    }

    /** ***** CHECK MINIMUM COLUMN REQUIREMENTS ***** **/
    /**
     * Should have at least 5 columns (0 asset scenario)
     * */

    if (!validate(fundSheetData[0].length, VALIDATION.FUND_SHEET_COLS_COUNT,
        errMsgs)) {
        return errMsgs
    }

    /** ***** CHECK DATA TYPE ***** **/
    /**
     * Checks performed:
     * - No duplicate headers
     * - No blank fund names
     * - No duplicate fund names
     * - No non-number amounts
     * - Blank amounts are allowed. These are converted to 0
     *
     * Note: ES5 array methods (except includes()) skip over
     * empty slots. This led to the use while loops which iterates over all
     * indexes. If includes() is used, then information about where the blanks
     * are can't be provided.
     * */

    const fundNames = [];  // Used to check for duplicate fund names
    const headers = [];  // Used to check for duplicate headers

    let stopLoop = false;
    let rowIndex = 0;
    while (rowIndex < fundSheetData.length && !stopLoop) {
        // Parse every row - It's guaranteed that there are no empty rows
        // from our confinement activity

        const fundData = fundSheetData[rowIndex];

        let colIndex = 0;
        while (colIndex < fundSheetData[0].length) {
            // At each row, parse every column
            // It's guaranteed that there are no empty headers from our
            // confinement activity, but there might still be empty column
            // data

            if (rowIndex === 0) {
                // Header row

                if (!validate(
                    {header: fundData[colIndex], rowIndex, colIndex, headers},
                    VALIDATION.FUND_SHEET_HEADER, errMsgs,
                ) && !REPORT_ALL_ERRORS) {
                    stopLoop = true;
                    break;
                }

                headers.push(fundData[colIndex]);
            } else if (colIndex === 0) {
                // Fund data row - Name column

                if (!validate(
                    {
                        fundName: fundData[colIndex],
                        rowIndex,
                        colIndex,
                        fundNames,
                        fundData,
                    }, VALIDATION.FUND_SHEET_FUND_NAME, errMsgs,
                ) && !REPORT_ALL_ERRORS) {
                    stopLoop = true;
                    break;
                }

                fundNames.push(fundData[colIndex]);
            } else if (!validate(
                {amount: fundData[colIndex], rowIndex, colIndex},
                VALIDATION.FUND_SHEET_AMOUNT, errMsgs,
            ) && !REPORT_ALL_ERRORS) {
                // Fund data row - "Amount" column

                stopLoop = true;
                break;
            }

            colIndex += 1;
        }

        if (!stopLoop) {
            rowIndex += 1;
        } else {
            break;
        }
    }

    return errMsgs
}

/** ********** ASSET SHEET DATA VALIDATION ********** **/
/**
 * The asset sheet is optional, therefore a blank sheet is accepted.
 * However, data, if present, must still conform to our specifications.
 * */

export function validateAssetSheetData(assetSheetData: any[]): string[] {
    // Store all error messages
    const errMsgs = [];

    /** ***** CHECK DATA TYPE ***** **/
    /**
     * Checks performed:
     * - No duplicate headers
     * - No blank asset names
     * - No duplicate asset names
     * - No non-number asset levels
     * - Blank asset levels are allowed. These default to 1
     *
     * Note: ES5 array methods (except includes()) skip over
     * empty slots. This led to the use while loops which iterates over all
     * indexes. If includes() is used, then information about where the blanks
     * are can't be provided.
     * */

    const assetNames = [];

    let stopLoop = false;
    let rowIndex = 0;
    while (rowIndex < assetSheetData.length && !stopLoop) {
        // Parse every row

        const assetData = assetSheetData[rowIndex];

        let colIndex = 0;
        while (colIndex < assetSheetData[0].length) {
            // At each row, parse every column

            if (rowIndex === 0) {
                // Header row

            } else if (colIndex === 0) {
                // Asset data row - Name column

                if (!validate(
                    {
                        assetName: assetData[colIndex],
                        rowIndex,
                        colIndex,
                        assetNames,
                        assetData,
                    }, VALIDATION.ASSET_SHEET_ASSET_NAME, errMsgs,
                ) && !REPORT_ALL_ERRORS) {
                    stopLoop = true;
                    break;
                }

                assetNames.push(assetData[colIndex]);
            } else if (colIndex === 1) {
                // Asset data row - Level column

                if (!validate(
                    {amount: assetData[colIndex], rowIndex, colIndex},
                    VALIDATION.ASSET_SHEET_ASSET_LEVEL, errMsgs,
                ) && !REPORT_ALL_ERRORS) {
                    stopLoop = true;
                    break;
                }
            } else if (colIndex === 2) {
                // Asset data row - Weighting column

                if (!validate(
                    {amount: assetData[colIndex], rowIndex, colIndex},
                    VALIDATION.ASSET_SHEET_ASSET_WEIGHTING, errMsgs,
                ) && !REPORT_ALL_ERRORS) {
                    stopLoop = true;
                    break;
                }
            }

            colIndex += 1;
        }

        if (!stopLoop) {
            rowIndex += 1;
        } else {
            break;
        }
    }

    return errMsgs
}
