// @flow

import XLSX from 'xlsx';

import type {CompanyData} from '../Types';

import {validateSheetData, validateAssetSheetData} from './dataValidation';
import refineData from './refineData';

const DEBUG = true;  // TODO: remove from production

/** ********** HELPERS ********** **/

function getMaxIndex(arr: any[]): number {
    let i = 0;
    while (i < arr.length) {
        if (!(i in arr)) {
            return i
        }

        if (Array.isArray(arr[i]) && arr[i].length === 0) {
            return i
        }

        i += 1;
    }
    return i
}

function getConfinedSheetData(
    arr: any[],
    maxRow: number,
    maxCol: number,
    defaultEmptyAmount?: number = 0,
): any[] {
    const finalArr = [];

    let rowIndex = 0;
    while (rowIndex < maxRow) {
        const row = arr[rowIndex];

        const finalCol = [];

        let colIndex = 0;
        while (colIndex < maxCol) {
            const col = row[colIndex];

            if (rowIndex !== 0 && colIndex !== 0) {
                finalCol.push(col === undefined ? defaultEmptyAmount : col);
            } else {
                finalCol.push(col);
            }

            colIndex += 1;
        }

        finalArr.push(finalCol);

        rowIndex += 1;
    }

    return finalArr
}

/** ********** PARSE SPREADSHEET ********** **/

type ProcessResult = {
    success: boolean,
    data: CompanyData[] | string[],
}

export default function processXlsx(data: ArrayBuffer): ProcessResult {
    try {
        // ********** Read workbook ********** //

        const workbook = XLSX.read(data, {type: 'array'});

        const fundSheet = workbook.Sheets[workbook.SheetNames[0]];
        const assetSheet = workbook.Sheets[workbook.SheetNames[1]];

        const fundSheetData = XLSX.utils.sheet_to_json(
            fundSheet,
            {header: 1},
        );
        const assetSheetData = XLSX.utils.sheet_to_json(
            assetSheet,
            {header: 1},
        );

        // ********** Confine data set ********** //

        // Limit the amount of rows to be parsed
        // Data in rows after a fully blank row will not be parsed and will not
        // be part of our final data set
        const maxFundSheetRow = getMaxIndex(fundSheetData);
        const maxAssetSheetRow = getMaxIndex(assetSheetData);

        // Limit the amount of columns to be parsed
        // Data in columns after the last non-blank header will not be parsed
        // and will not be part of our final data set
        const maxFundSheetCol = getMaxIndex(fundSheetData[0]);
        const maxAssetSheetCol = 3;

        const confinedFundSheetData = getConfinedSheetData(
            fundSheetData, maxFundSheetRow, maxFundSheetCol, 0,
        );
        const confinedAssetSheetData = getConfinedSheetData(
            assetSheetData, maxAssetSheetRow, maxAssetSheetCol, 1,
        );

        if (DEBUG) {
            console.log('confined fundSheetData: ');
            console.log(confinedFundSheetData);
            console.log('confined assetSheetData: ');
            console.log(confinedAssetSheetData);
        }

        // ********** Validate data ********** //

        const fundDataValidationErrMsgs = validateSheetData(
            confinedFundSheetData,
        );
        const assetDataValidationErrMsgs = validateAssetSheetData(
            confinedAssetSheetData,
        );

        if (fundDataValidationErrMsgs.length > 0
            || assetDataValidationErrMsgs.length > 0) {
            return {
                success: false,
                data: fundDataValidationErrMsgs
                    .concat(assetDataValidationErrMsgs),
            }
        }

        // ********** Refine & return data set ********** //

        return {
            success: true,
            data: refineData(confinedFundSheetData, confinedAssetSheetData),
        }
    } catch (e) {
        throw e
    }
}
