// @flow

import XLSX from 'xlsx';

import type {FundData, AssetData} from '../../components/DataTypes';

/** ********** UTILITIES ********** **/

function colNumToColName(n: number): string {
    try {
        // Assuming column 0 = A

        let dividend = n;
        let colName = '';
        let modulo;

        while (dividend > 0) {
            modulo = dividend % 26;
            colName += String.fromCharCode(65 + modulo);
            dividend = parseInt((dividend - modulo) / 26, 10);
        }

        return colName || 'A'
    } catch (e) {
        return e
    }
}

/** ********** DATA VALIDATION ********** **/

type ValidationResult = {
    valid: boolean,
    msg: string[],
};

function validateFundSheetData(fundSheetData: [][]): ValidationResult {
    /** ***** CHECK EMPTINESS ***** **/

    if (!fundSheetData || fundSheetData.length < 1) {
        return {
            valid: false,
            msg: ['Empty fund sheet data. Please add data in accordance with our guidance.'],
        }
    }

    /** ***** CHECK MINIMUM DATA REQUIREMENTS ***** **/

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
     * Special note: ES5 array methods (except includes()) skip over
     * empty slots. This led to the use while loops which iterates over all
     * indexes. If includes() is used, then information about where the blanks
     * are can't be provided.
     *
     * Note: if the below don't make you appreciate ES5 array methods, I don't
     * know what will
     * */

    const maxColumn = fundSheetData[0].length;  // Limit how much data to check for non-header rows
    const errMsg = ['Invalid data.'];

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

                // There must be no blank headers (empty slot)
                if (!(colIndex in fundData)) {
                    errMsg.push(`Header at cell ${colNumToColName(colIndex)}1 is blank. `
                        + 'There might be more issues, but the check stopped here.');
                    isDataValid = false;
                    break;
                }

                // There must be no blank headers
                if (!fundData[colIndex]) {
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

/** ********** DATA PROCESSING ********** **/

export function processXlsx(data: ArrayBuffer): [] | Error {  // TODO:
    try {
        // Read workbook

        const workbook = XLSX.read(data, {type: 'array'});

        const fundSheet = workbook.Sheets[workbook.SheetNames[0]];
        const assetSheet = workbook.Sheets[workbook.SheetNames[1]];

        const fundSheetData = XLSX.utils.sheet_to_json(fundSheet, {header: 1, blankrows: false});
        const assetSheetData = XLSX.utils.sheet_to_json(assetSheet, {header: 1, blankrows: false});

        console.log('fundSheetData: ');
        console.log(fundSheetData);
        console.log('assetSheetData: ');
        console.log(assetSheetData);

        // Validate data

        const validationRes = validateFundSheetData(fundSheetData);

        if (validationRes.valid) {
            console.log('Validation success!');
            console.log(validationRes.msg);
        } else {
            console.log(validationRes.msg.join('\n'));
            // return Error(validationRes.msg.join('\n'))
        }

        // Process data

        /*// Construct asset levels reference object

        const assetLvls = {};

        if (assetSheetData.length > 1) {
            assetSheetData.forEach((rowData, rowIndex) => {
                if (rowIndex !== 0) {
                    // Row is not header

                    assetLvls[rowData[0]] = rowData[1];
                }
            })
        }

        // Construct fund data


        let idsCount = 0;

        fundSheetData.map((rowData, rowIndex) => {
            if (rowIndex !== 0) {
                // Row is not header


                idsCount += 1;


                return {
                    id: idsCount,
                    name: rowData[0],
                    iCom: rowData[1],
                    iCal: rowData[2],
                    fCom: rowData[3],
                    fCal: rowData[4],
                    assets:,
                }
            }
        });*/

        return []
    } catch (e) {
        throw e
    }
}
