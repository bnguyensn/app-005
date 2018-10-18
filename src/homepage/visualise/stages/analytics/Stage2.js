// @flow

import * as React from 'react';

import {stylesGen} from '../createStage';

import type {StageAnalyticsProps} from '../createStage';

export default function Stage2(props: StageAnalyticsProps) {
    const styles = stylesGen(4, 1, 1);

    return (
        <React.Fragment>
            <div className="title"
                 style={styles[0]}>
                Rings
            </div>
            <div className="description"
                 style={styles[1]}>
                The outer rings represent total flows.
            </div>
            <div className="description"
                 style={styles[2]}>
                In this diagram, each ring shows{' '}
                total trade outflows of each G7 country.
            </div>
            <div className="footnote"
                 style={styles[3]}>
                Click the dots or use the left and right arrow keys to continue.
            </div>
        </React.Fragment>
    )
}
