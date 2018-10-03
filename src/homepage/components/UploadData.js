// @flow

import * as React from 'react';

import {isFileOfType} from '../lib/utils/validation';
import processXlsx from '../lib/utils/xlsx/processXlsx';
import createColorData from '../lib/utils/xlsx/createColorData';

import type {FundData} from './DataTypes';

import defaultColorBank from '../json/default-color-bank';

const DEBUG = true;  // TODO: remove in production

type UploadDataProps = {
    setNewData: (data: FundData[]) => void,
};

export default class UploadData extends React.PureComponent<UploadDataProps, {}> {
    fileTypes: string[];

    constructor(props: UploadDataProps) {
        super(props);
        this.fileTypes = [
            'application/vnd.ms-excel',  // .csv, .xls
            'application/vnd.ms-excel.sheet.binary.macroEnabled.12',  // .xlsb
            'application/vnd.ms-excel.sheet.macroEnabled.12',  // .xlsm
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // .xlsx
        ];
    }

    handleFileSelected = (e: SyntheticInputEvent<HTMLElement>) => {
        const {setNewData} = this.props;

        const {files} = e.target;
        const f = files[0];

        if (files.length === 0) {
            console.log('No files selected');
        } else {
            console.log(`Selected file's name is ${f.name}`);
            console.log(`Selected file's size is ${(f.size / 1024).toFixed(0)} kb`);
            console.log(`Selected file is of type ${f.type}`);

            if (isFileOfType(f, this.fileTypes)) {
                // Set up FileReader
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = e.target.result;

                    const processedData = processXlsx(data);

                    if (processedData instanceof Error) {
                        if (DEBUG) console.log(processedData);
                    } else {
                        // Update color data using a sample fund

                        const colorData = createColorData(processedData[0].assets);

                        // Update fund data

                        if (DEBUG) {
                            console.log('Successfullly read .xlsx. Result data:');
                            console.log(processedData);
                            // console.log(JSON.stringify(processedData));
                        }

                        setNewData(processedData, colorData);
                    }
                };

                // Read xlsx
                reader.readAsArrayBuffer(f);
            }
        }
    };

    render() {
        return (
            <div id="cp-upload" className="cp-section">
                <label className="cp-upload-btn" htmlFor="cp-uploader">
                    <span>UPLOAD DATA</span>
                    <input id="cp-uploader"
                           type="file"
                           accept=".xlsx, .xls, .xlsb, .xlsm, .csv"
                           onChange={this.handleFileSelected} />
                </label>

            </div>
        )
    }
}
