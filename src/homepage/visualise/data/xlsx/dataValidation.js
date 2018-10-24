// @flow

import * as VALIDATION from './validationFns';

import type {Sheet} from './readWorkbook';
import type {ValidationData, ValidationFns} from './validationFns';

/** ********** CONFIGS ********** **/

// If true, will parse all data and return all found errors
const REPORT_ALL_ERRORS = true;

/** ********** TYPES ********** **/

export type SheetErrMsgs = string[];

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
function validate(data: ValidationData, validationFns: ValidationFns[],
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

/** ********** SHEET VALIDATION ********** **/

export default function validateSheetData(sheet: Sheet): SheetErrMsgs {
    // Store all error messages
    const errMsgs: SheetErrMsgs = [];

    /** ***** CHECK SHEET SHAPE ***** **/
    /**
     * Number of rows must be equal to number of columns
     * Number of rows / columns must be >= 3 (else there's nothing to visualise)
     * */

    if (!validate({
        rowsCount: sheet.length,
        colsCount: sheet[0].length,
    }, VALIDATION.SHEET_SHAPE, errMsgs)) {
        return errMsgs
    }

    /** ***** CHECK DATA TYPE ***** **/
    /**
     * Checks performed:
     * - Row names must match column names
     * - Names must not be duplicated (between either row or column)
     * - No blank names
     *
     * - No non-numeric amounts
     * - Blank amounts are converted to 0
     *
     * Note: ES5 array methods (except includes()) skip over
     * empty slots. This led to the use while loops which iterates over all
     * indexes. If includes() is used, then information about where the blanks
     * are can't be provided.
     * */

    const namesRow = [];  // Check for duplicate names in rows
    const namesCol = [];  // Check for duplicate names in columns

    let stopLoop = false;
    let rowIndex = 0;
    while (rowIndex < sheet.length && !stopLoop) {
        // Parse every row - It's guaranteed that there are no empty rows
        // from our confinement activity

        const rowData = sheet[rowIndex];

        let colIndex = 0;
        while (colIndex < sheet[0].length) {
            // At each row, parse every column
            // It's guaranteed that there are no empty fslis from our
            // confinement activity, but there might still be empty column
            // data

            // Put the most common checks in front for efficiency

            if (rowIndex > 0 && colIndex > 0) {
                // ***** Amounts ***** //

                if (!validate(
                    {
                        value: rowData[colIndex],
                        rowIndex,
                        colIndex,
                    },
                    VALIDATION.SHEET_AMOUNT, errMsgs,
                ) && !REPORT_ALL_ERRORS) {
                    // Data row - "Amount" column

                    stopLoop = true;
                    break;
                }
            } else if (rowIndex === 0 && colIndex > 0) {
                // ***** Names row ***** //

                if (!validate(
                    {
                        value: rowData[colIndex],
                        rowIndex,
                        colIndex,
                        values: namesRow,
                    }, VALIDATION.NAMES_ROW, errMsgs,
                ) && !REPORT_ALL_ERRORS) {
                    stopLoop = true;
                    break;
                }

                namesRow.push(rowData[colIndex]);
            } else if (rowIndex > 0 && colIndex === 0) {
                // ***** Names column ***** //

                if (!validate(
                    {
                        value: rowData[colIndex],
                        rowIndex,
                        colIndex,
                        values: namesCol,
                    }, VALIDATION.NAMES_COL, errMsgs,
                ) && !REPORT_ALL_ERRORS) {
                    stopLoop = true;
                    break;
                }

                namesCol.push(rowData[colIndex]);
            }

            colIndex += 1;
        }

        if (!stopLoop) {
            rowIndex += 1;
        } else {
            break;
        }
    }

    if (!validate({
        namesRow,
        namesCol,
    }, VALIDATION.NAMES_ROW_COL, errMsgs)) {
        return errMsgs
    }

    return errMsgs
}
