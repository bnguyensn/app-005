// @flow

import * as React from 'react';
import {Link} from '@reach/router';

import Page from '../app-components/Page';

import './intro.css';

export default function Intro() {
    return (
        <Page id="intro">
            <div className="title">
                INVESTMENT FUND OVERCOMMITMENT CHARTING TOOL
            </div>
            <div className="subtitle">
                A D3.js / SheetJS / React tech demo by Binh Nguyen
            </div>
            <div className="description delay-1">
                {'A common assessment of an investment fund\'s going concern'
                + ' involves looking at its remaining investment commitments '
                + 'and check whether they can be fulfilled using the '
                + 'fund\'s available assets.'}
            </div>
            <div className="description delay-2">
                {'With adequate data, this tool can graph the '
                + 'overcommitment situation of investment funds and help '
                + 'speed up going concern decisions.'}
            </div>
            <div className="description delay-3">
                Please head over to the <Link to="/data">DATA</Link>{' '}
                section to get started.
            </div>
        </Page>
    )
}
