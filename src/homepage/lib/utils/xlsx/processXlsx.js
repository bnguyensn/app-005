// @flow

import XLSX from 'xlsx';

import type {FundData} from '../../../components/DataTypes';

import {validateFundSheetData, validateAssetSheetData} from './dataValidation';
import {refineFundData} from './dataRefinement';

export default function processXlsx(data: ArrayBuffer): FundData[] | Error {
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

        const fundDataValidation = validateFundSheetData(fundSheetData);
        const assetDataValidation = validateAssetSheetData(assetSheetData);

        console.log(fundDataValidation.msg);
        console.log(assetDataValidation.msg);

        if (!fundDataValidation.valid) {
            return Error([...fundDataValidation.msg, ...assetDataValidation.msg].join('\n'))
        }

        // Refine & return data

        return refineFundData(fundSheetData, assetSheetData);
    } catch (e) {
        throw e
    }
}
