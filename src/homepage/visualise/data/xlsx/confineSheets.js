// @flow

import type {Sheet, SheetNames, SheetRow, Sheets} from './readWorkbook';

function getSheetRowLimit(sheet: Sheet): number {
    // Note: cannot use ES6 array methods because they ignore empty slots

    let i = 0;
    while (i < sheet.length) {
        if (!(i in sheet)) {
            // Blank encountered
            return i
        }

        if (Array.isArray(sheet[i]) && sheet[i].length === 0) {
            // This might not be necessary...  //TODO
            return i
        }

        i += 1;
    }
    return i
}

function getSheetColLimit(row: SheetRow): number {
    let i = 0;
    while (i < row.length) {
        if (!(i in row) || i === undefined || i == null) {
            // Blank encountered
            return i
        }

        i += 1;
    }
    return i
}

function confineSheet(
    sheet: Sheet,
    maxRow: number,
    maxCol: number,
    defaultEmptyAmount?: number = 0,
): Sheet {
    const confinedSheet = [];

    let rowIndex = 0;
    while (rowIndex < maxRow) {
        const curRow = sheet[rowIndex];
        const newRow = [];

        let colIndex = 0;
        while (colIndex < maxCol) {
            const d = curRow[colIndex];

            newRow.push(d === undefined || d === null
                ? defaultEmptyAmount
                : d);

            colIndex += 1;
        }

        confinedSheet.push(newRow);

        rowIndex += 1;
    }

    return confinedSheet
}

/**
 * Rows after a fully blank row are not parsed
 * Columns after the first blank row 0 are not parsed
 *
 * Can throw error
 * */
export default function confineSheets(
    sheets: Sheets,
    sheetNames: SheetNames,
): Sheets | Error {
    try {
        return sheetNames.reduce((confinedSheets, sheetName) => {
            const sheet = sheets[sheetName];

            // Limit the amount of rows to be parsed
            const rowMax = getSheetRowLimit(sheet);

            // Limit the amount of columns to be parsed
            const colMax = getSheetColLimit(sheet[0]);

            confinedSheets[sheetName] = confineSheet(
                sheet, rowMax, colMax, 0,
            );

            return confinedSheets
        }, {});
    } catch (e) {
        throw e
    }
}
