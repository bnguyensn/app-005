// @flow

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

            // Headers are rows 0 - 2, id is column 0

            if (rowIndex > 1 && colIndex !== 0) {
                // Put a default empty amount in

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

export default function confineDataset(
    dataset: any,
    sheetNames: ?string[],
): any {
    try {
        if (sheetNames) {
            return sheetNames.reduce((acc, sheetName) => {
                const sheetObj = dataset[sheetName];

                // Limit the amount of rows to be parsed
                // Data in rows after a fully blank row will not be parsed and will
                // not be part of our final data set
                const maxSheetRow = getMaxIndex(sheetObj);

                // Limit the amount of columns to be parsed
                // Data in columns after the last non-blank header will not be
                // parsed and will not be part of our final data set
                const maxSheetCol = getMaxIndex(sheetObj[0]);

                acc[sheetName] = getConfinedSheetData(sheetObj, maxSheetRow,
                    maxSheetCol, 0);

                return acc
            }, {});
        }

        // Limit the amount of rows to be parsed
        // Data in rows after a fully blank row will not be parsed and will
        // not be part of our final data set
        const maxSheetRow = getMaxIndex(dataset);

        // Limit the amount of columns to be parsed
        // Data in columns after the last non-blank header will not be
        // parsed and will not be part of our final data set
        const maxSheetCol = getMaxIndex(dataset[0]);

        return getConfinedSheetData(dataset, maxSheetRow, maxSheetCol, 0);
    } catch (e) {
        throw e
    }
}
