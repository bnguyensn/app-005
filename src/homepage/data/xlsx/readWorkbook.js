// @flow

import XLSX from 'xlsx';

export default function readWorkbook(data: ArrayBuffer): [any, any] {
    try {
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

        return [fundSheetData, assetSheetData]
    } catch (e) {
        throw e
    }
}
