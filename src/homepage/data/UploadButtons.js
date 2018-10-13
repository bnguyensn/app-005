// @flow

import * as React from 'react';

import {ClickableDiv} from '../lib/components/Clickable';

import {isFileOfType} from './xlsx/utils';
import readWorkbook from './xlsx/readWorkbook';
import confineDataset from './xlsx/confineDataset';
import validateData from './xlsx/validateData';
import refineData from './xlsx/refineData';
import createColorData from './xlsx/createColorData';

import type {ColorData, FundData} from './DataTypes';

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

type UploadButtonsProps = {
    setNewData: (FundData[], ColorData) => void,
    setDataStatus: (string, ?string[]) => void,
};

export default function UploadButtons(props: UploadButtonsProps) {
    const {setNewData, setDataStatus} = props;

    const reportErrors = (errorMsgs: string[]) => {
        setDataStatus(
            'Error uploading data - See error messages below. '
            + 'Feel free to revise and re-provide data.',
            errorMsgs,
        );
    };

    const parseUserData = (e: SyntheticInputEvent<HTMLElement>) => {
        const {files} = e.target;
        const f = files[0];

        if (files.length === 0) {
            setDataStatus('Ready to parse new data.');

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

                    let fundSheetData, assetSheetData;

                    try {
                        [fundSheetData, assetSheetData] = readWorkbook(data);
                    } catch (e) {
                        reportErrors([e]);
                        return
                    }

                    // ********** 2. Confine data set ********** //

                    let confinedFundSheetData, confinedAssetSheetData;

                    try {
                        [confinedFundSheetData, confinedAssetSheetData]
                            = confineDataset(fundSheetData, assetSheetData);
                    } catch (e) {
                        reportErrors([e]);
                        return
                    }

                    if (DEBUG) {
                        console.log('confined fundSheetData:');
                        console.log(confinedFundSheetData);
                        console.log('confined assetSheetData:');
                        console.log(confinedAssetSheetData);
                    }

                    // ********** 3. Validate data ********** //

                    let errMsgs;

                    try {
                        const [fundDataErrs, assetDataErrs] = validateData(
                            confinedFundSheetData, confinedAssetSheetData,
                        );

                        errMsgs = [...fundDataErrs, ...assetDataErrs];

                        if (DEBUG) {
                            console.log('errMsgs:');
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

                    // ********** 4. Refine data set ********** //

                    let refinedData;

                    try {
                        refinedData = refineData(
                            confinedFundSheetData,
                            confinedAssetSheetData,
                        );

                        if (DEBUG) {
                            console.log('refinedData:');
                            console.log(JSON.stringify(refinedData));
                        }
                    } catch (e) {
                        reportErrors([e]);
                        return
                    }

                    // ********** 5. Set new fund and color data ********** //

                    const colorData = createColorData(refinedData);

                    setDataStatus('n/a', [], 1);

                    setNewData(refinedData, colorData);

                    if (DEBUG) {
                        console.log('*** Data upload procedures completed ***');
                    }
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

    const generateRandomData = () => {
        console.log('Generating random data...');  // TODO:
    };

    return (
        <div id="upload-buttons">
            <label className="data-btn green" htmlFor="uploader">
                SELECT FILE
                <input id="uploader"
                       type="file"
                       accept={acceptableExtensions}
                       onChange={parseUserData} />
            </label>
            <ClickableDiv className="data-btn blue"
                          action={generateRandomData}>
                GENERATE DATA
            </ClickableDiv>
        </div>
    )
}
