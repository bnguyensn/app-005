// @flow

import XLSX from 'xlsx';

import type {FundData, AssetData} from '../../components/DataTypes';

/** ********** UTILITIES ********** **/

function colNumToColName(n: number): string {
    try {
        let dividend = n;
        let colName = '';
        let modulo;

        // Assuming column 0 = A

        while (dividend > 0) {
            modulo = dividend % 26;
            colName += String.fromCharCode(65 + modulo);
            dividend = parseInt((dividend - modulo) / 26, 10);
        }

        return colName
    } catch (e) {
        return e
    }
}

/** ********** MAIN FUNCTIONS ********** **/

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

    const maxColumn = fundSheetData[0].length;  // Limit how much data to check for non-header rows
    const errMsg = ['Some data is not numeric.'];

    const isTypeValid = fundSheetData.every((fundDataRow, rowIndex) => {
        if (rowIndex === 0) {
            // Header row
            return true
        }
        return fundDataRow.every((fundData, colIndex) => {
            if (colIndex === 0 || colIndex >= maxColumn) {
                // Name data
                return true
            }
            const convertedData = parseInt(fundData, 10);
            if (typeof convertedData === 'number' && !Number.isNaN(convertedData)) {
                return true
            }
            errMsg.push(`Data ${fundData} at cell `
            + `${colNumToColName(colIndex)}${rowIndex + 1} is not numeric. `
            + 'There might be more, but the check stopped here.');
            return false
        })
    });

    if (!isTypeValid) {
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

export function processXlsx(data: ArrayBuffer): [] {  // TODO:
    try {
        const workbook = XLSX.read(data, {type: 'array'});

        const fundSheet = workbook.Sheets[workbook.SheetNames[0]];
        const assetSheet = workbook.Sheets[workbook.SheetNames[1]];

        const fundSheetData = XLSX.utils.sheet_to_json(fundSheet, {header: 1, blankrows: false});
        const assetSheetData = XLSX.utils.sheet_to_json(assetSheet, {header: 1, blankrows: false});

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

        console.log('fundSheetData: ');
        console.log(fundSheetData);
        console.log('assetSheetData: ');
        console.log(assetSheetData);

        console.log(validateFundSheetData(fundSheetData).msg);

        return []
    } catch (e) {
        throw e
    }
}
