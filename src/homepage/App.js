// @flow

import * as React from 'react';
import Loadable from 'react-loadable';

import Loading from './components/Loading';

import createColorScale
    from './visualise/main-chart/chart-funcs/createColorScale';
import {getMainChartSize} from './visualise/chartSizes';
import createChordData
    from './visualise/main-chart/chart-funcs/createChordData';
import {createUpdatesNewData} from './visualise/stages/createUpdates';
import refineData from './visualise/data/xlsx/refineData';

import type {
    DataConfig, DisplayConfig, DataAll, ColorScale, ChartData,
    Updates, ActiveItems,
}
    from './visualise/data/Types';
import type {SheetNames} from './visualise/data/xlsx/readWorkbook';
import type {ArcChartSize} from './visualise/chartSizes';

import defaultCSheets from './visualise/data/json/default-c-sheets';
import defaultSheetNames from './visualise/data/json/default-sheet-names';
import defaultDataConfig from './visualise/data/json/default-data-config';
import defaultDisplayConfig from './visualise/data/json/default-display-config';
import defaultColorData from './visualise/data/json/default-color-data';

import './app.css';

/** ********** LOADABLES ********** **/

const LoadableVisualise = Loadable({
    loader: () => import('./visualise/Visualise'),
    loading: Loading,
});

/** ********** CONFIGS ********** **/

const resizeDebounceDelay = 750;

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

    dataAll: ?DataAll,
    sheetNames: SheetNames,
    colorScale: ColorScale,

    chartData: ChartData,

    dataConfig: DataConfig,
    displayConfig: DisplayConfig,

    sizes: ?{mainChartSize: ArcChartSize},

    mode: string,
    activeItems: ActiveItems,
    updates: ?Updates,

    allowEvents: boolean,
};

/** ********** MAIN ********** **/

export default class App extends React.PureComponent<{}, AppStates> {
    defaultDataAll: DataAll;
    resizeDebounceT: any;

    constructor(props: {}) {
        super(props);

        const colorScale = createColorScale(defaultColorData);

        this.state = {
            dataKey: false,

            dataAll: null,
            sheetNames: defaultSheetNames,
            colorScale,

            chartData: {
                cur: null,
                prev: null,
            },

            dataConfig: defaultDataConfig,
            displayConfig: defaultDisplayConfig,

            sizes: null,

            activeItems: {
                hovered: null,
                clicked: null,
            },
            updates: null,

            allowEvents: true,
        };
    }

    componentDidMount() {
        const {sheetNames, dataConfig} = this.state;

        const dataAll = refineData(defaultCSheets, sheetNames, dataConfig);
        this.defaultDataAll = dataAll;
        const data = dataAll[sheetNames[0]]
            .dataInfo.dataExtended[dataConfig.dataType];
        const curChordData = createChordData(data);
        const sizes = {
            mainChartSize: getMainChartSize(
                window.innerWidth, window.innerHeight,
            ),
        };

        this.setState((prevState: AppStates) => ({
            dataKey: !prevState.dataKey,
            dataAll,
            chartData: {
                cur: curChordData,
                prev: null,
            },
            sizes,
            updates: createUpdatesNewData(
                data, null,
                curChordData, null,
                dataAll[sheetNames[dataConfig.curSheet]].nameData,
                prevState.colorScale,
                sizes.mainChartSize,
            ),
        }));

        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    handleWindowResize = () => {
        clearTimeout(this.resizeDebounceT);

        this.resizeDebounceT = setTimeout(
            this.windowResizeCB, resizeDebounceDelay,
        );
    };

    windowResizeCB = (): [number, number] => {
        const {
            dataAll, sheetNames, chartData, colorScale,
            dataConfig, sizes,
        } = this.state;

        // ***** Resize ***** //

        const newSizes = {
            mainChartSize: getMainChartSize(
                window.innerWidth, window.innerHeight,
            ),
        };

        if (newSizes.mainChartSize.width !== sizes.mainChartSize.width
            || newSizes.mainChartSize.height !== sizes.mainChartSize.height) {
            // ***** New updates ***** //

            const data = dataAll[sheetNames[dataConfig.curSheet]]
                .dataInfo.dataExtended[dataConfig.dataType];

            const newUpdates = createUpdatesNewData(
                data, null,
                chartData.cur, chartData.prev,
                dataAll[sheetNames[dataConfig.curSheet]].nameData, colorScale,
                newSizes.mainChartSize,
            );

            this.setState({
                sizes: newSizes,
                updates: newUpdates,
            });
        }
    };

    setNewData = (
        dataAll: DataAll,
        sheetNames: SheetNames,
        colorScale: ColorScale,
        dataConfig: DataConfig,
        displayConfig: DisplayConfig,
    ) => {
        const data = dataAll[sheetNames[0]]
            .dataInfo.dataExtended[dataConfig.dataType];
        const curChordData = createChordData(data);
        const sizes = {
            mainChartSize: getMainChartSize(
                window.innerWidth, window.innerHeight,
            ),
        };

        this.setState((prevState: AppStates) => ({
            dataKey: !prevState.dataKey,

            dataAll,
            sheetNames,
            colorScale,

            chartData: {
                cur: curChordData,
                prev: null,
            },

            dataConfig,
            displayConfig,

            sizes,

            activeItems: {
                hovered: null,
                clicked: null,
            },
            updates: createUpdatesNewData(
                data, null,
                curChordData, null,
                dataAll[sheetNames[dataConfig.curSheet]].nameData, colorScale,
                sizes.mainChartSize,
            ),

            allowEvents: true,
        }));
    };

    resetDataSet = () => {
        this.setNewData(
            this.defaultDataAll,
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
                <LoadableVisualise setNewData={this.setNewData}
                           resetDataSet={this.resetDataSet}
                           changeState={this.changeState}
                           changeStates={this.changeStates}
                           {...this.state} />
            </div>
        )
    }
}
