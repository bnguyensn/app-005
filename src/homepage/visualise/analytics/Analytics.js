// @flow

import * as React from 'react';

import Tutorial from '../tutorial/Tutorial';
import AnalyticsDisplay from './AnalyticsDisplay';

import type {Stage} from '../stages/createStage';

import './analytics.css';

type AnalyticsProps = {
    stages: Stage[],
    curStage: number,
    changeState: (string, any) => void,
};

export default function Analytics(props: AnalyticsProps) {
    const {stages, curStage, changeState} = props;

    return (
        <div id="analytics">
            <Tutorial stages={stages}
                      curStage={curStage}
                      changeState={changeState} />
            <AnalyticsDisplay stage={stages[curStage]} />
        </div>
    )
}
