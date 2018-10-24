// @flow

import validateSheetData from './dataValidation';

import type {SheetNames, Sheets} from './readWorkbook';
import type {SheetErrMsgs} from './dataValidation';

export type SheetsErrMsgs = {[key: string]: SheetErrMsgs};

/**
 * From the confined sheets object, return an object with keys = sheet names
 * and values = an array of error messages
 *
 * Can throw error
 * */
export default function validateData(
    sheets: Sheets,
    sheetNames: SheetNames,
): SheetsErrMsgs | Error {
    try {
        return sheetNames.reduce((sheetsErrMsgs, sheetName) => {
            sheetsErrMsgs[sheetName] = validateSheetData(sheets[sheetName]);
            return sheetsErrMsgs
        }, {})
    } catch (e) {
        throw e
    }
}
