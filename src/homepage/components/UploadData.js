// @flow

import * as React from 'react';

import {isFileOfType} from '../lib/utils/validation';
import processXlsx from '../lib/utils/xlsx/processXlsx';

type UploadDataProps = {
    updateData: () => void,
};

export default class UploadData extends React.PureComponent<{}, {}> {
    fileTypes: string[];

    constructor(props: {}) {
        super(props);
        this.fileTypes = [
            'application/vnd.ms-excel',  // .csv, .xls
            'application/vnd.ms-excel.sheet.binary.macroEnabled.12',  // .xlsb
            'application/vnd.ms-excel.sheet.macroEnabled.12',  // .xlsm
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // .xlsx
        ];
    }

    handleFileSelected = (e: SyntheticInputEvent<HTMLElement>) => {
        const {updateData} = this.props;

        const {files} = e.target;
        const f = files[0];

        if (files.length === 0) {
            console.log('No files selected');
        } else {
            console.log(`Selected file's name is ${f.name}`);
            console.log(`Selected file's size is ${(f.size / 1024).toFixed(0)} kb`);
            console.log(`Selected file is of type ${f.type}`);

            if (isFileOfType(f, this.fileTypes)) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = e.target.result;
                    try {
                        const processedData = processXlsx(data);

                        /*if (processedData instanceof Error) {
                            console.log(processedData);
                        } else {
                            console.log(processedData);
                        }*/
                        // updateData(processXlsx(data));
                    } catch (e) {
                        throw e
                    }
                };

                reader.readAsArrayBuffer(f);
            }
        }
    };

    render() {
        return (
            <div id="cp-upload" className="cp-section">
                <label htmlFor="cp-uploader">
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
