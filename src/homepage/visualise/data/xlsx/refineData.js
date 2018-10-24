// @flow

import generateDataInfo from './generateDataInfo';

import type {Data, DataConfig, DataAll, NameData} from '../Types';
import type {SheetNames, Sheets} from './readWorkbook';

/** ********** CONFIGS ********** **/

// TODO: if data is large -> store its thousandth or something
const amtAdj = 1000;

const rowHeadersCount = 1;
const colHeadersCount = 1;

/** ********** MAIN ********** **/

export default function refineData(
    sheets: Sheets,
    sheetNames: SheetNames,
    dataConfig: DataConfig,
): DataAll {
    return sheetNames.reduce((dataAll, sheetName) => {
        // Split out data / nameData

        const data: Data = sheets[sheetName]
            .filter((row, rowIndex) => rowIndex >= rowHeadersCount)
            .map(row => (
                row.filter((col, colIndex) => colIndex >= colHeadersCount)
                    .map(amt => Number(amt))
            ));

        const nameData: NameData = sheets[sheetName][0]
            .filter((col, colIndex) => colIndex > 0)
            .map(name => name.toString());

        // Create the dataAll.sheet object

        dataAll[sheetName] = {};

        dataAll[sheetName].dataInfo = generateDataInfo(
            data,
            nameData,
            dataConfig,
        );
        dataAll[sheetName].nameData = nameData;

        return dataAll
    }, {})
}
