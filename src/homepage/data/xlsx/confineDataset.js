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

export default function confineDataset(
    fundSheetData: any,
    assetSheetData: any,
): [any, any] {
    try {
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

        return [confinedFundSheetData, confinedAssetSheetData]
    } catch (e) {
        throw e
    }
}
