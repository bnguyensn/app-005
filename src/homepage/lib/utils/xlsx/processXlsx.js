// @flow

import XLSX from 'xlsx';

import {validateFundSheetData, validateAssetSheetData} from './dataValidation';
import {refineFundData, refineAssetData} from './dataRefinement';

export default function processXlsx(data: ArrayBuffer): [] | Error {  // TODO:
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

        // Refine data

        const refinedFundData = refineFundData(fundSheetData, assetSheetData);

        /**/

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
