// @flow

import * as React from 'react';

import type {Stage} from '../stages/createStage';

type AnalyticsDisplayProps = {
    stage: Stage,
};

export default function AnalyticsDisplay(props: AnalyticsDisplayProps) {
    const {stage} = props;

    return (
        <div id="analytics-display">
            {stage.analytics}
        </div>
    )
}
