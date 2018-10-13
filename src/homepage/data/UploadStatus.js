// @flow

import * as React from 'react';
import {Link} from '@reach/router';

type UploadStatusProps = {
    dataStatus: string,
    errorMsgs: ?string[],
    specialDataStatus: ?number,
}

export default function UploadStatus(props: UploadStatusProps) {
    const {dataStatus, errorMsgs, specialDataStatus} = props;

    const dataStatusMsg = specialDataStatus === 1
        ? (
            <div>
                Data successfully passes all validations! Head over{' '}
                to the <Link to="/visualise">VISUALISE</Link> tab for{' '}
                analysis. Also feel free to re-provide new data set.
            </div>
        )
        : dataStatus;

    const errorMsgsDivs = errorMsgs && errorMsgs.length > 0
        ? errorMsgs.map(errMsg => (
            <div key={`${errMsg}`}
                 className="upload-err">
                {errMsg}
            </div>
        ))
        : <div className="upload-err">No errors.</div>;

    return (
        <React.Fragment>
            <div id="upload-status"
                 className={specialDataStatus === 1 ? 'green' : ''}>
                {dataStatusMsg}
            </div>
            <div id="upload-errs">
                {errorMsgsDivs}
            </div>
        </React.Fragment>
    )
}
