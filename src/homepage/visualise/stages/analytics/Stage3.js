// @flow

import * as React from 'react';

import {stylesGen} from '../createStage';

import type {StageAnalyticsProps} from '../createStage';

export default function Stage3(props: StageAnalyticsProps) {
    const styles = stylesGen(4, 1, 1);

    return (
        <React.Fragment>
            <div className="title"
                 style={styles[0]}>
                Ribbons
            </div>
            <div className="description"
                 style={styles[1]}>
                The ribbons represent flows from one entity to another.
            </div>
            <div className="description"
                 style={styles[2]}>
                In this diagram, each ribbon shows a trade flow between{' '}
                two country.
            </div>
            <div className="footnote"
                 style={styles[3]}>
                Click the dots or use the left and right arrow keys to continue.
            </div>
        </React.Fragment>
    )
}
