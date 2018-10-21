// @flow

import * as React from 'react';

import {stylesGen} from '../createStage';

import type {AnalyticsProps} from '../createStage';

export default function Stage1(props: AnalyticsProps) {
    const styles = stylesGen(4, 1, 1);

    return (
        <React.Fragment>
            <div className="title"
                 style={styles[0]}>
                Overview
            </div>
            <div className="description"
                 style={styles[1]}>
                Chord diagrams are commonly used to visualise{' '}
                bi-directional data flows.
            </div>
            <div className="description"
                 style={styles[2]}>
                The data set being used for this tutorial is the{' '}
                2016 trade movements between the G7 countries.
            </div>
            <div className="footnote"
                 style={styles[3]}>
                Click the dots or use the left and right arrow keys to continue.
            </div>
        </React.Fragment>
    )
}
