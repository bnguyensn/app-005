// @flow

import * as React from 'react';

import Tutorial from '../tutorial/Tutorial';

import DefaultNoneHovered from './displays/DefaultNoneHovered';
import DefaultRingHovered from './displays/DefaultRingHovered';

import type {Data, DataConfig, NameData, DataInfo} from '../../data/DataTypes';
import type {Stage} from '../stages/createStage';

import './analytics.css';

export type AnalyticsProps = {
    data: Data,
    nameData: NameData,
    colorScale: any,

    dataConfig: DataConfig,
    dataInfo: DataInfo,

    mode: string,
    stages: Stage[],
    curStage: number,

    changeState: (string, any) => void,
};

export type AnalyticsDisplayProps = {
    data: Data,
    nameData: NameData,
    colorScale: any,

    dataConfig: DataConfig,
    dataInfo: DataInfo,

    mode: string,
    stage: Stage,

    changeState: (string, any) => void,
};

export default function Analytics(props: AnalyticsProps) {
    const {
        data, nameData, colorScale,
        dataConfig, dataInfo,
        mode, stages, curStage,
        changeState,
    } = props;
    const stage = stages[curStage];

    return (
        <div id="analytics">
            {mode === 'walkthrough'
                ? (
                    <Tutorial stages={stages}
                              curStage={curStage}
                              changeState={changeState} />
                )
                : null
            }
            <div id="analytics-display">
                {mode === 'normal' && stage.evtInfo && stage.evtInfo.type
                    && stage.evtInfo.targetRingIndex
                    ? (
                        <DefaultRingHovered data={data}
                                            nameData={nameData}
                                            colorScale={colorScale}
                                            dataConfig={dataConfig}
                                            dataInfo={dataInfo}
                                            mode={mode}
                                            stage={stage}
                                            changeState={changeState} />
                    )
                    : (
                        <DefaultNoneHovered data={data}
                                            nameData={nameData}
                                            colorScale={colorScale}
                                            dataConfig={dataConfig}
                                            dataInfo={dataInfo}
                                            mode={mode}
                                            stage={stage}
                                            changeState={changeState} />
                    )}

            </div>
        </div>
    )
}
