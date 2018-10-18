// @flow

import validateSheetData from './dataValidation';

/**
 * From the confined sheets object, return an object with keys = sheet names
 * and values = an array of error messages
 * */
export default function validateData(
    dataset: any,
    sheetNames: ?string[],
): {[key: string]: string[]} | string[] {
    try {
        if (sheetNames) {
            return sheetNames.reduce((acc, sheetName) => {
                acc[sheetName] = validateSheetData(dataset[sheetName]);
                return acc
            }, {})
        }

        return validateSheetData(dataset);
    } catch (e) {
        throw e
    }
}
