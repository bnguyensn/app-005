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
    changeStates: (newStates: {}) => void,
};

export default class Visualise
    extends React.PureComponent<VisualiseProps, {}> {
    render() {
        const {
            dataKey,
            data, nameData, colorScale,
            dataConfig, dataInfo,
            sizes,
            mode, stages, curStage,
            allowEvents,
            changeState,
            changeStates,
        } = this.props;

        return (
            <Page id="visualise">
                <Chart dataKey={dataKey}
                       data={data}
                       nameData={nameData}
                       colorScale={colorScale}
                       size={sizes.mainChartSize}
                       mode={mode}
                       stages={stages}
                       curStage={curStage}
                       allowEvents={allowEvents}
                       changeState={changeState}
                       changeStates={changeStates} />
                <Analytics data={data}
                           nameData={nameData}
                           colorScale={colorScale}
                           dataConfig={dataConfig}
                           dataInfo={dataInfo}
                           mode={mode}
                           stages={stages}
                           curStage={curStage}
                           changeState={changeState} />
            </Page>
        )
    }
}
