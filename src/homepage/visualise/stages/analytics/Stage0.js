// @flow

import * as React from 'react';

import {stylesGen} from '../createStage';

import type {StageAnalyticsProps} from '../createStage';

export default function Stage0(props: StageAnalyticsProps) {
    const styles = stylesGen(4, 1, 1);

    return (
        <React.Fragment>
            <div className="title"
                 style={styles[0]}>
                Chord Diagram Tutorial
            </div>
            <div className="description"
                 style={styles[1]}>
                Hello and welcome! This tutorial will take you through{' '}
                the sample Chord Diagram shown here.
            </div>
            <div className="description"
                 style={styles[2]}>
                Please navigate using the dots above, or the left and right{' '}
                arrow keys.
            </div>
            <div className="description" style={styles[3]}>
                Have fun!
            </div>
        </React.Fragment>
    )
}
