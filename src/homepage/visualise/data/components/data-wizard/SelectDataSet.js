// @flow

import * as React from 'react';

import {isFileOfType} from '../../xlsx/utils';
import readWorkbook from '../../xlsx/readWorkbook';
import confineSheets from '../../xlsx/confineSheets';
import validateData from '../../xlsx/validateData';
import refineData from '../../xlsx/refineData';

import type {DataAll, DataConfig, DataType} from '../../Types';
import type {SheetNames, Sheets} from '../../xlsx/readWorkbook';
import type {SheetsErrMsgs} from '../../xlsx/validateData';

/** ********** CONFIGS ********** **/

const DEBUG = true;  // TODO: remove in production

const acceptableFileTypes = [
    // .csv, .xls
    'application/vnd.ms-excel',

    // .xlsb
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12',

    // .xlsm
    'application/vnd.ms-excel.sheet.macroEnabled.12',

    // .xlsx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const acceptableExtensions = '.xlsx, .xls, .xlsb, .xlsm, .csv';

const dataTypes: DataType[] = ['normal', 'transpose', 'net', 'gross'];

/** ********** TYPES ********** **/

export type ErrMsgs = string[];

type SelectDataSetProps = {
    dataConfig: DataConfig,
    updateDataSet: (DataAll, SheetNames) => void,
    setDataStatus: (dataStatus: number, errMsgs?: ErrMsgs) => void,
};

/** ********** MAIN ********** **/

export default function SelectDataSet(props: SelectDataSetProps) {
    const {dataConfig, updateDataSet, setDataStatus} = props;

    const reportErrors = (errMsgs: ErrMsgs) => {
        setDataStatus(5, errMsgs);
    };

    const parseUserData = (e: SyntheticInputEvent<HTMLElement>) => {
        const {files} = e.target;
        const f = files[0];

        if (files.length === 0) {
            setDataStatus(1);

            if (DEBUG) console.log('No files selected');
        } else {
            if (DEBUG) {
                console.log(`Selected file's name is ${f.name}`);
                console.log(`Selected file's size is ${(f.size / 1024)
                    .toFixed(0)} kb`);
                console.log(`Selected file is of type ${f.type}`);
            }

            if (isFileOfType(f, acceptableFileTypes)) {
                const reader = new FileReader();

                // Set up file reading procedures
                reader.onload = (e) => {
                    const data = e.target.result;

                    // ********** 1. Read workbook ********** //

                    let sheets: Sheets, sheetNames: SheetNames;

                    try {
                        const readRes = readWorkbook(data);

                        if (readRes && !(readRes instanceof Error)) {
                            [sheets, sheetNames] = readRes;

                            if (DEBUG) {
                                console.log('*** Part 1 results ***');
                                console.log('sheetNames:');
                                console.log(sheetNames);
                                console.log('sheets:');
                                console.log(sheets);
                            }
                        } else {
                            reportErrors(['Not enough sheets in provided '
                            + 'spreadsheet. Please revise.']);
                            return
                        }
                    } catch (e) {
                        reportErrors([e]);
                        return
                    }

                    // ********** 2. Confine data set ********** //

                    let cSheets: Sheets;

                    try {
                        cSheets = confineSheets(sheets, sheetNames);
                    } catch (e) {
                        reportErrors([e]);
                        return
                    }

                    if (DEBUG) {
                        console.log('*** Part 2 results ***');
                        console.log('confinedSheets:');
                        console.log(cSheets);
                        console.log(JSON.stringify(cSheets));
                    }

                    // ********** 3. Validate data ********** //

                    try {
                        const cSheetsErrMsgs: SheetsErrMsgs = validateData(
                            cSheets, sheetNames,
                        );

                        // Re-construct error message arrays
                        const errMsgs: ErrMsgs = sheetNames
                            .reduce((acc, sheetName) => {
                                const cSheetErrMsgs = cSheetsErrMsgs[sheetName];

                                if (cSheetErrMsgs.length > 0) {
                                    acc.push(...cSheetErrMsgs.map(msg => (
                                        `${sheetName}: ${msg}`
                                    )));
                                }

                                return acc
                            }, []);


                        if (DEBUG) {
                            console.log('*** Part 3 results ***');
                            console.log('Validation errors:');
                            console.log(errMsgs);
                        }

                        if (errMsgs.length > 0) {
                            reportErrors(errMsgs);
                            return
                        }
                    } catch (e) {
                        reportErrors([e]);
                        return
                    }

                    // ********** 4. Refine data ********** //

                    const dataAll = refineData(
                        cSheets,
                        sheetNames,
                        dataConfig,
                    );

                    if (DEBUG) {
                        console.log('*** Part 4 results ***');
                        console.log('dataAll:');
                        console.log(dataAll);
                        //console.log(JSON.stringify(dataAll));
                    }

                    // ********** 5. Create chart data ********** //

                    /*const chartData: ChartData[] = sheetNames
                        .map(sheetName => ({
                            chordData: dataTypes
                                .reduce((chordData, dataType) => {
                                    chordData[dataType] = createChordData(
                                        dataAll[sheetName]
                                            .dataInfo.dataExtended[dataType],
                                    );
                                    return chordData
                                }, {}),
                        }));

                    if (DEBUG) {
                        console.log('*** Part 5 results ***');
                        console.log('chartData:');
                        console.log(chartData);
                        //console.log(JSON.stringify(chartData));
                    }*/

                    // ********** 6. Set new data set ********** //

                    setDataStatus(2);
                    updateDataSet(dataAll, sheetNames);
                };

                // Actually start reading the file
                reader.readAsArrayBuffer(f);
            } else {
                reportErrors([
                    'Invalid file type selected. Only files of type'
                    + `${acceptableExtensions} are accepted.`,
                ]);
                if (DEBUG) console.log('Incorrect file type chosen.');
            }
        }
    };

    return (
        <div id="select-data-set-ctn">
            <label className="data-button green"
                   htmlFor="select-data-set-uploader">
                SELECT DATA SET
                <input id="select-data-set-uploader"
                       type="file"
                       accept={acceptableExtensions}
                       onChange={parseUserData} />
            </label>
        </div>
    )
}
