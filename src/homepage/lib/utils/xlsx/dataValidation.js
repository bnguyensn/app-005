// @flow

import {colNumToColName} from './utils';



type ValidationResult = {
    valid: boolean,
    msg: string[],
};

/** ********** FUND SHEET DATA VALIDATION ********** **/

export function validateFundSheetData(fundSheetData: any[]): ValidationResult {
    /** ***** CHECK EMPTINESS ***** **/

    if (fundSheetData.length < 2) {
        return {
            valid: false,
            msg: ['Empty fund sheet data or no headers. Please add data in accordance with our guidance.'],
        }
    }

    /** ***** CHECK MINIMUM COLUMN REQUIREMENTS ***** **/
    /**
     * Should have at least 5 columns (0 asset scenario)
     * */

    if (fundSheetData[0].length < 5) {
        return {
            valid: false,
            msg: ['Not enough fund sheet data. Please check if supplied data matches our guidance.'],
        }
    }

    /** ***** CHECK DATA TYPE ***** **/
    /**
     * Checks performed:
     * - No blank rows
     * - No blank headers
     * - No blank fund names
     * - No duplicate fund names
     * - No non-number amounts
     * - Blank amounts are allowed. These are converted to 0
     *
     * Note: ES5 array methods (except includes()) skip over
     * empty slots. This led to the use while loops which iterates over all
     * indexes. If includes() is used, then information about where the blanks
     * are can't be provided.
     *
     * Special note: if the below don't make you appreciate ES5 array methods, I don't
     * know what will
     * */

    const maxColumn = fundSheetData[0].length;  // Limit how much data to check for non-header rows
    const errMsg = ['Invalid fund data.'];
    const fundNames = [];

    let isDataValid = true;
    let rowIndex = 0;
    while (rowIndex < fundSheetData.length && isDataValid) {
        // There must be no blank rows (empty slot)
        if (!(rowIndex in fundSheetData)) {
            errMsg.push(`Row ${rowIndex + 1} is blank. `
                + 'There might be more issues, but the check stopped here.');
            isDataValid = false;
            break;
        }

        const fundData = fundSheetData[rowIndex];

        let colIndex = 0;
        while (colIndex < maxColumn) {
            if (rowIndex === 0) {
                // Header row

                // There must be no blank headers
                if (!(colIndex in fundData) || !fundData[colIndex]) {
                    errMsg.push(`Header at cell ${colNumToColName(colIndex)}1 is blank. `
                        + 'There might be more issues, but the check stopped here.');
                    isDataValid = false;
                    break;
                }
            } else if (colIndex === 0) {
                // Fund data row - Name column

                // There must be no blank names - However, there can be blank "amounts"
                if (!('0' in fundData) || !fundData[colIndex]) {
                    errMsg.push(`Fund name at cell ${colNumToColName(colIndex)}${rowIndex + 1} is blank. `
                        + 'There might be more issues, but the check stopped here.');
                    isDataValid = false;
                    break;
                }

                // There must be no duplicated names
                if (fundNames.includes(fundData[colIndex])) {
                    errMsg.push(`Fund name at cell ${colNumToColName(colIndex)}${rowIndex + 1} is duplicated. `
                        + 'There might be more issues, but the check stopped here.');
                    isDataValid = false;
                    break;
                }
                fundNames.push(fundData[colIndex]);
            } else {
                // Fund data row - "Amount" column

                // "Amounts" data must be numeric
                const convertedData = parseInt(fundData[colIndex], 10);
                if (typeof convertedData !== 'number' || Number.isNaN(convertedData)) {
                    errMsg.push(`Data ${fundData[colIndex]} at cell `
                        + `${colNumToColName(colIndex)}${rowIndex + 1} is not numeric. `
                        + 'There might be more issues, but the check stopped here.');
                    isDataValid = false;
                    break;
                }
            }

            colIndex += 1;
        }

        rowIndex += 1;
    }

    if (!isDataValid) {
        return {
            valid: false,
            msg: errMsg,
        }
    }

    return {
        valid: true,
        msg: ['Fund sheet data is valid.'],
    }
}

/** ********** ASSET SHEET DATA VALIDATION ********** **/

export function validateAssetSheetData(assetSheetData: any[]): ValidationResult {
    /** ***** CHECK EMPTINESS ***** **/

    if (assetSheetData.length < 2) {
        return {
            valid: false,
            msg: ['Asset level data was not provided or no headers provided. All assets will default to level 1.'],
        }
    }

    /** ***** CHECK MINIMUM COLUMN REQUIREMENTS ***** **/
    /**
     * Should have at least 2 columns for asset names and asset levels
     * */

    if (assetSheetData[0].length < 2) {
        return {
            valid: false,
            msg: ['Not enough asset sheet data. Please check if supplied data matches our guidance.'],
        }
    }

    /** ***** CHECK DATA TYPE ***** **/
    /**
     * Checks performed:
     * - No blank headers
     * - No blank asset names
     * - No blank asset levels
     * - No non-number asset levels
     *
     * Note: ES5 array methods (except includes()) skip over
     * empty slots. This led to the use while loops which iterates over all
     * indexes. If includes() is used, then information about where the blanks
     * are can't be provided.
     *
     * Special note: if the below don't make you appreciate ES5 array methods, I don't
     * know what will
     * */

    const maxColumn = 2;  // Only two columns: asset name and asset level
    const errMsg = ['Invalid asset data.'];

    let isDataValid = true;
    let rowIndex = 0;
    while (rowIndex < assetSheetData.length && isDataValid) {
        const assetData = assetSheetData[rowIndex];

        let colIndex = 0;
        while (colIndex < maxColumn) {
            // There must be no blank headers, names, and levels
            if (!(colIndex.toString() in assetData) || !assetData[colIndex]) {
                errMsg.push(`Cell ${colNumToColName(colIndex)}${rowIndex + 1} is blank. `
                    + 'There might be more issues, but the check stopped here.');
                isDataValid = false;
                break;
            }

            if (rowIndex !== 0 && colIndex !== 0) {
                // Asset data row - Asset level column

                // Level data must be numeric
                const convertedData = parseInt(assetData[colIndex], 10);
                if (typeof convertedData !== 'number' || Number.isNaN(convertedData)) {
                    errMsg.push(`Asset level ${assetData[colIndex]} at cell `
                        + `${colNumToColName(colIndex)}${rowIndex + 1} is not numeric. `
                        + 'There might be more issues, but the check stopped here.');
                    isDataValid = false;
                    break;
                }
            }

            colIndex += 1;
        }

        rowIndex += 1;
    }

    if (!isDataValid) {
        return {
            valid: false,
            msg: errMsg,
        }
    }

    return {
        valid: true,
        msg: ['Asset sheet data is valid.'],
    }
}
