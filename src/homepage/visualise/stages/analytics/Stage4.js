// @flow

import * as React from 'react';

import {stylesGen} from '../createStage';

import type {AnalyticsProps} from '../createStage';

export default function Stage4(props: AnalyticsProps) {
    const {activeRings, data, nameData, colorScale} = props;
    const i = activeRings[0];

    const styles = stylesGen(4, 1, 1);

    return (
        <React.Fragment>
            <div className="title"
                 style={styles[0]}>
                <span style={{color: colorScale(i)}}>
                    {nameData[i]}
                </span>
            </div>
            <div className="description"
                 style={styles[1]}>
                Let&rsquo;s look at{' '}
                <span style={{color: colorScale(i)}}>
                    {nameData[i]}
                </span>
            </div>
            <div className="description"
                 style={styles[2]}>
                ??
            </div>
            <div className="footnote"
                 style={styles[3]}>
                Click the dots or use the left and right arrow keys to continue.
            </div>
        </React.Fragment>
    )
}
