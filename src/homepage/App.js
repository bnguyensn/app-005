// @flow

import * as React from 'react';
import Loadable from 'react-loadable';
import {Router, Link} from '@reach/router';

import Loading from './components/Loading';
import Header from './components/Header';

import {createNormalStage, createWalkthroughStages}
    from './visualise/stages/createStage';
import createColorScale
    from './visualise/main-chart/chart-funcs/createColorScale';
import generateDataInfo from './visualise/data/xlsx/generateDataInfo';
import {mainChartSize} from './visualise/chartSizes';

import type {
    ColorData, NameData, Data, DataInfo, DataConfig, DisplayConfig, DataAll,
    ColorScale,
} from './visualise/data/Types';
import type {SheetNames} from './visualise/data/xlsx/readWorkbook';
import type {ArcChartSize} from './visualise/chartSizes';
import type {Stage} from './visualise/stages/createStage';

import defaultDataAll from './visualise/data/json/default-data-all';
import defaultSheetNames from './visualise/data/json/default-sheet-names';
import defaultDataConfig from './visualise/data/json/default-data-config';
import defaultDisplayConfig from './visualise/data/json/default-display-config';
import defaultColorData from './visualise/data/json/default-color-data';
import defaultNameData from './visualise/data/json/default-name-data-g7';

import './app.css';

/** ********** LOADABLES ********** **/

const LoadableIntro = Loadable({
    loader: () => import('./intro/Intro'),
    loading: Loading,
});

const LoadableVisualise = Loadable({
    loader: () => import('./visualise/Visualise'),
    loading: Loading,
});

/** ********** TYPES ********** **/

export type SetNewDataFn = (
    dataAll: DataAll,
    sheetNames: SheetNames,
    colorScale: ColorScale,
    dataConfig: DataConfig,
    displayConfig: DisplayConfig,
) => void;

// All sorts of data should sit here else user will lose states upon navigating
// the app
export type AppStates = {
    // Used to "hard reset" components upon receipt of new data
    dataKey: boolean,

    dataAll: DataAll,
    sheetNames: SheetNames,
    colorScale: ColorScale,

    dataConfig: DataConfig,
    displayConfig: DisplayConfig,

    sizes: {mainChartSize: ArcChartSize},

    mode: string,
    stages: Stage[],
    curStage: number,

    allowEvents: boolean,
};

/** ********** MAIN ********** **/

export default class App extends React.PureComponent<{}, AppStates> {
    constructor(props: {}) {
        super(props);

        const mode = 'normal';
        const normalStage = [createNormalStage()];
        const walkthroughStages = [
            ...createWalkthroughStages(
                defaultDataAll,
                defaultNameData,
                this.colorScale,
            ),
        ];

        this.state = {
            dataKey: false,

            dataAll: defaultDataAll,
            sheetNames: defaultSheetNames,
            colorScale: createColorScale(defaultColorData),

            dataConfig: defaultDataConfig,
            displayConfig: defaultDisplayConfig,

            sizes: {mainChartSize},

            mode,
            stages: mode === 'normal'
                ? normalStage
                : walkthroughStages,
            curStage: 0,

            allowEvents: mode !== 'walkthrough',
        };
    }

    setNewData = (
        dataAll: DataAll,
        sheetNames: SheetNames,
        colorScale: ColorScale,
        dataConfig: DataConfig,
        displayConfig: DisplayConfig,
    ) => {
        const mode = 'normal';
        const normalStage = [createNormalStage()];
        const walkthroughStages = [
            ...createWalkthroughStages(
                defaultDataAll,
                defaultNameData,
                this.colorScale,
            ),
        ];

        this.setState((prevState: AppStates) => ({
            dataKey: !prevState.dataKey,

            dataAll,
            sheetNames,
            colorScale,

            dataConfig,
            displayConfig,

            sizes: {mainChartSize},

            mode,
            stages: mode === 'normal'
                ? normalStage
                : walkthroughStages,
            curStage: 0,

            allowEvents: mode !== 'walkthrough',
        }));
    };

    resetDataSet = () => {
        this.setNewData(
            defaultDataAll,
            defaultSheetNames,
            createColorScale(defaultColorData),
            defaultDataConfig,
            defaultDisplayConfig,
        );

        console.log('data set reset');  // TODO: show tooltip
    };

    changeState = (state: string, newState: any) => {
        this.setState({
            [state]: newState,
        });
    };

    changeStates = (newStates: {}) => {
        this.setState(newStates);
    };

    render() {
        return (
            <div id="app">
                <Header />
                <Router>
                    <LoadableIntro path="/" />
                    <LoadableVisualise path="/visualise"
                                       setNewData={this.setNewData}
                                       resetDataSet={this.resetDataSet}
                                       changeState={this.changeState}
                                       changeStates={this.changeStates}
                                       {...this.state} />
                </Router>
            </div>
        )
    }
}
