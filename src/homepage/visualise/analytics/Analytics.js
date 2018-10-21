// @flow

import * as React from 'react';

import Tutorial from '../tutorial/Tutorial';

import DefaultNoneHovered from './displays/DefaultNoneHovered';
import DefaultRingHovered from './displays/DefaultRingHovered';
import DefaultRibbonHovered from './displays/DefaultRibbonHovered';

import type {Data, DataConfig, NameData, DataInfo, DisplayConfig}
    from '../../data/DataTypes';
import type {Stage} from '../stages/createStage';

import './analytics.css';

export type AnalyticsProps = {
    data: Data,
    nameData: NameData,
    colorScale: any,

    dataConfig: DataConfig,
    dataInfo: DataInfo,
    displayConfig: DisplayConfig,

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
    displayConfig: DisplayConfig,

    mode: string,
    stage: Stage,

    changeState: (string, any) => void,
};

export default function Analytics(props: AnalyticsProps) {
    const {
        data, nameData, colorScale,
        dataConfig, dataInfo, displayConfig,
        mode, stages, curStage,
        changeState,
    } = props;
    const stage = stages[curStage];

    let defA;
    if (mode === 'normal' && stage.evtInfo && stage.evtInfo.type) {
        if (stage.evtInfo.targetRingIndex) {
            defA = 'RING';
        } else if (stage.evtInfo.targetRibbonName) {
            defA = 'RIBBON';
        }
    } else {
        defA = null;
    }

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
                {defA === 'RING'
                    ? (
                        <DefaultRingHovered data={data}
                                            nameData={nameData}
                                            colorScale={colorScale}
                                            dataConfig={dataConfig}
                                            displayConfig={displayConfig}
                                            dataInfo={dataInfo}
                                            mode={mode}
                                            stage={stage}
                                            changeState={changeState} />
                    )
                    : defA === 'RIBBON'
                        ? (
                            <DefaultRibbonHovered data={data}
                                                nameData={nameData}
                                                colorScale={colorScale}
                                                dataConfig={dataConfig}
                                                displayConfig={displayConfig}
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
                                                displayConfig={displayConfig}
                                                dataInfo={dataInfo}
                                                mode={mode}
                                                stage={stage}
                                                changeState={changeState} />
                        )}

            </div>
        </div>
    )
}
