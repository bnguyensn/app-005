// @flow

import * as React from 'react';

import {stylesGen} from '../createStage';

import type {AnalyticsProps} from '../createStage';

export default function Stage0(props: AnalyticsProps) {
    const styles = stylesGen(4, 1, 1);

    return (
        <React.Fragment>
            <div className="title"
                 style={styles[0]}>
                Chord Diagram Introduction
            </div>
            <div className="description"
                 style={styles[1]}>
                A chord diagram is commonly used to visualise{' '}
                bi-directional flow data.
            </div>
            <div className="description"
                 style={styles[2]}>
                One notable example of these kind of visualisations is the{' '}
                BBC&rsquo;s{' '}
                <a href="https://www.bbc.co.uk/news/business-15748696">
                    Eurozone debt map
                </a>.
            </div>
            <div className="description" style={styles[3]}>
                Have fun!
            </div>
        </React.Fragment>
    )
}
