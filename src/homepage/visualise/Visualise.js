// @flow

import * as React from 'react';

import Page from '../app-components/Page';
import Chart from './main-chart/Chart';

import type {AppStates} from '../App';

import './visualise.css';
import Analytics from './analytics/Analytics';

type VisualiseProps = {
    ...AppStates,
    changeState: (state: string, newState: any) => void,
};

export default class Visualise
    extends React.PureComponent<VisualiseProps, {}> {
    render() {
        const {
            dataKey,
            data, nameData, colorScale,
            sizes,
            mode, stages, curStage,
            allowEvents,
            changeState,
        } = this.props;

        return (
            <Page id="visualise">
                <Analytics stages={stages}
                           curStage={curStage}
                           changeState={changeState} />
                <Chart dataKey={dataKey}
                       data={data}
                       nameData={nameData}
                       colorScale={colorScale}
                       size={sizes.mainChartSize}
                       mode={mode}
                       stages={stages}
                       curStage={curStage}
                       allowEvents={allowEvents}
                       changeState={changeState} />

            </Page>
        )
    }
}
