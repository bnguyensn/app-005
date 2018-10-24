// @flow

import * as React from 'react';

import Tutorial from '../tutorial/Tutorial';

import DefaultNoneHovered from './displays/DefaultNoneHovered';
import DefaultRingHovered from './displays/DefaultRingHovered';
import DefaultRibbonHovered from './displays/DefaultRibbonHovered';

import type {DataConfig, DisplayConfig, DataAll, ColorScale}
    from '../data/Types';
import type {Stage} from '../stages/createStage';
import type {SheetNames} from '../data/xlsx/readWorkbook';

import './analytics.css';


export type AnalyticsProps = {
    dataAll: DataAll,
    sheetNames: SheetNames,
    colorScale: ColorScale,

    dataConfig: DataConfig,
    displayConfig: DisplayConfig,

    mode: string,
    stages: Stage[],
    curStage: number,

    changeState: (string, any) => void,
};

export type AnalyticsDisplayProps = {
    dataAll: DataAll,
    sheetNames: SheetNames,
    colorScale: ColorScale,

    dataConfig: DataConfig,
    displayConfig: DisplayConfig,

    mode: string,
    stage: Stage,

    changeState: (string, any) => void,
};

export default function Analytics(props: AnalyticsProps) {
    const {
        dataAll, sheetNames, colorScale,
        dataConfig, displayConfig,
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
                        <DefaultRingHovered dataAll={dataAll}
                                            sheetNames={sheetNames}
                                            colorScale={colorScale}
                                            dataConfig={dataConfig}
                                            displayConfig={displayConfig}
                                            mode={mode}
                                            stage={stage}
                                            changeState={changeState} />
                    )
                    : defA === 'RIBBON'
                        ? (
                            <DefaultRibbonHovered dataAll={dataAll}
                                                  sheetNames={sheetNames}
                                                  colorScale={colorScale}
                                                  dataConfig={dataConfig}
                                                  displayConfig={displayConfig}
                                                  mode={mode}
                                                  stage={stage}
                                                  changeState={changeState} />
                        )
                        : (
                            <DefaultNoneHovered dataAll={dataAll}
                                                sheetNames={sheetNames}
                                                colorScale={colorScale}
                                                dataConfig={dataConfig}
                                                displayConfig={displayConfig}
                                                mode={mode}
                                                stage={stage}
                                                changeState={changeState} />
                        )}

            </div>
        </div>
    )
}
