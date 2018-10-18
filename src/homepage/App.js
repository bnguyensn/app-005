// @flow

import * as React from 'react';
import Loadable from 'react-loadable';
import {Router, Link} from '@reach/router';

import Loading from './app-components/Loading';
import Header from './app-components/Header';

import {createNormalStage, createWalkthroughStages}
    from './visualise/stages/createStage';
import createColorScale
    from './visualise/main-chart/chart-funcs/createColorScale';

import {mainChartSize}
    from './visualise/chartSizes';

import type {ColorData, NameData, Data}
    from './data/DataTypes';
import type {ArcChartSize}
    from './visualise/chartSizes';
import type {Stage} from './visualise/stages/createStage';

import defaultData from './data/json/default-data';
import defaultNameData from './data/json/default-name-data';
import defaultColorData from './data/json/default-color-data';

import './app.css';

const LoadableIntro = Loadable({
    loader: () => import('./intro/Intro'),
    loading: Loading,
});

const LoadableData = Loadable({
    loader: () => import('./data/Data'),
    loading: Loading,
});

const LoadableVisualise = Loadable({
    loader: () => import('./visualise/Visualise'),
    loading: Loading,
});

/**
 * All sorts of data should sit here else user will lose states upon navigating
 * the app
 * */
export type AppStates = {
    // Used to "hard reset" components upon receipt of new data
    dataKey: boolean,

    data: ?Data,
    nameData: ?NameData,
    colorScale: ?ColorData,

    sizes: {
        mainChartSize: ArcChartSize,
    },

    mode: 'normal' | 'walkthrough',
    stages: Stage[],
    curStage: number,

    allowEvents: boolean,
};

export default class App extends React.PureComponent<{}, AppStates> {
    colorScale: any;

    constructor(props: {}) {
        super(props);

        this.colorScale = createColorScale(defaultColorData);

        const walkthroughStages = [
            ...createWalkthroughStages(
                defaultData,
                defaultNameData,
                this.colorScale,
            ),
        ];

        this.state = {
            dataKey: false,

            data: defaultData,
            colorScale: this.colorScale,
            nameData: defaultNameData,

            sizes: {mainChartSize},

            mode: 'normal',
            stages: walkthroughStages,
            curStage: 0,

            allowEvents: false,
        };
    }

    setNewData = (data: Data, nameData: NameData, colorData: ?ColorData) => {
        if (colorData) this.colorScale = createColorScale(colorData);

        const walkthroughStages = [
            ...createWalkthroughStages(
                defaultData,
                defaultNameData,
                this.colorScale,
            ),
        ];

        this.setState((prevState: AppStates) => ({
            dataKey: !prevState.dataKey,

            data,
            nameData,
            colorScale: this.colorScale,

            sizes: {mainChartSize},

            mode: 'normal',
            stages: walkthroughStages,
            curStage: 0,

            allowEvents: false,
        }));
    };

    changeState = (state: string, newState: any) => {
        this.setState({
            [state]: newState,
        });
    };

    render() {
        return (
            <div id="app">
                <Header />
                <Router>
                    <LoadableIntro path="/" />
                    <LoadableData path="/data"
                                  setNewData={this.setNewData} />
                    <LoadableVisualise path="/visualise"
                                       changeState={this.changeState}
                                       {...this.state} />
                </Router>
            </div>
        )
    }
}
