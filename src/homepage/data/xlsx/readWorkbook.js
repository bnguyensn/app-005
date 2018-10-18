// @flow

import XLSX from 'xlsx';

export type Sheets = any[];  // {sheetName: sheetObj, ...}
export type SheetNames = string[];

export default function readWorkbook(
    data: ArrayBuffer,
): ?[Sheets, SheetNames] {
    try {
        const workbook = XLSX.read(data, {type: 'array'});

        // Parse all sheets

        const sheets = workbook.SheetNames.map(sheetName => (
            XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1})
        ));

        return [sheets, workbook.SheetNames]
    } catch (e) {
        throw e
    }
}
