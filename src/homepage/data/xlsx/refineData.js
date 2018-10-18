// @flow

import type {Data, NameData} from '../DataTypes';

/** ********** CONFIGS ********** **/

const amtAdj = 1;  // TODO: change data stored to be @ thousands for performance

/** ********** REFINEMENTS ********** **/

function createData(sheetObj: any): [Data, NameData] {
    const data = sheetObj
        .filter((row, rowIndex) => rowIndex > 0)
        .map(row => row.filter((col, colIndex) => colIndex > 0));

    const nameData = sheetObj[0].filter((col, colIndex) => colIndex > 0);

    return [data, nameData]
}

export default function refineData(
    dataset: any,
    sheetNames: ?string[],
): any[] {
    if (sheetNames) {
        return sheetNames.map(sheetName => (
            createData(dataset[sheetName])
        ))
    }

    return createData(dataset)
}
