// @flow

import * as React from 'react';

import '../css/intro.css';

export default function Intro() {
    return (
        <div id="intro">
            <div className="title">
                INVESTMENT FUND OVERCOMMITMENT CHARTING TOOL
            </div>
            <div className="subtitle">
                by Binh Nguyen
            </div>
            <div className="description">
                {"A common assessment of an investment fund's going concern"
                + ' involves looking at its remaining investment commitments '
                + 'and check whether they can be fulfilled using the '
                + "fund's current assets."}
            </div>
            <div className="description">
                {'With adequate data, this tool can graph the '
                + 'overcommitment situation of investment funds and help '
                + 'speed up going concern decisions.'}
            </div>
        </div>
    )
}
