// @flow

import XLSX from 'xlsx';

export type SheetData = string | number;
export type SheetRow = SheetData[];
export type Sheet = SheetRow[];
export type Sheets = {[key: string]: Sheet};  // {sheetName: sheetObj, ...}
export type SheetNames = string[];

/**
 * @return An array containing:
 * - index 0: the 'sheets' object. Its keys correspond the the read
 * spreasheet's sheet names, with each value being is a r x c matrix
 * corresponding to the read spreadsheet's sheets
 * - index 1: the 'workbook.SheetNames' array. This array contains all the
 * read spreadsheet's sheet names, in order of appearance.
 *
 * Can throw error
 * */
export default function readWorkbook(
    data: ArrayBuffer,
): [Sheets, SheetNames] | Error {
    try {
        const workbook = XLSX.read(data, {type: 'array'});

        // Parse all sheets

        const sheets = workbook.SheetNames.reduce((s, sheetName) => {
            s[sheetName] = XLSX.utils
                .sheet_to_json(workbook.Sheets[sheetName], {header: 1});
            return s
        }, {});

        return [sheets, workbook.SheetNames]
    } catch (e) {
        throw e
    }
}
