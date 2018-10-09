// @flow

import * as React from 'react';
import Loadable from 'react-loadable';

import Loading from './components/Loading';
import Intro from './components/Intro';
import {mainChartSize, assetsChartSize} from './components/chartSizes';
import {filterData, sortData} from './lib/utils/dataMutation';

import type {FundData, ColorData} from './components/DataTypes';

import './app.css';

import defaultData from './json/default-data';
import defaultColorData from './json/default-color-data';

type AppStates = {
    chartKey: boolean,  // Used to "reset" page elements on data upload
    data: FundData[],
    mutatedData: FundData[],
    colorData: ColorData,

    filterIndices: number[],
    filterRange: {min: number, max: number},

    mainChartElClickedFlag: boolean,
    lastClickedFundData: ?FundData,
}

const LoadableControlPanel = Loadable({
    loader: () => import('./components/control-panel/ControlPanel'),
    loading: Loading,
});

const LoadableChart = Loadable({
    loader: () => import('./components/chart/Chart'),
    loading: Loading,
});

const LoadableLegend = Loadable({
    loader: () => import('./components/legend/Legend'),
    loading: Loading,
});

const LoadableAnalytics = Loadable({
    loader: () => import('./components/analytics/Analytics'),
    loading: Loading,
});

export default class App extends React.PureComponent<{}, AppStates> {
    constructor(props: {}) {
        super(props);
        this.state = {
            chartKey: false,
            data: [...defaultData],
            mutatedData: [...defaultData],
            colorData: defaultColorData,

            // filterIndices contains all of data's indices initially
            filterIndices: Array.from(Array(defaultData.length).keys()),
            filterRange: {min: 0, max: 1},

            mainChartElClickedFlag: false,
            lastClickedFundData: null,
        };
    }

    logStatusMsg = (msg: string | string[]) => {
        // Log status message for user
        if (Array.isArray(msg)) {
            msg.forEach((m) => {
                console.log(m);
            });
        } else {
            console.log(msg);
        }
    };

    /**
     * Called when a new dataset is uploaded. This resets the chart element via
     * changing its "key" prop.
     * */
    setNewData = (data: FundData[], colorData: ColorData) => {
        this.setState((prevState: AppStates) => ({
            chartKey: !prevState.chartKey,
            data: [...data],
            mutatedData: [...data],
            colorData: {...colorData},
            filterIndices: Array.from(Array(defaultData.length).keys()),
            filterRange: {min: 0, max: 1},
            lastClickedFundData: null,
        }));
    };

    filterData = (min: number, max: number) => {
        const {data, mutatedData} = this.state;

        const nextMutatedData = filterData(data, mutatedData, min, max);

        if (nextMutatedData) {
            this.setState({
                mutatedData: [...nextMutatedData],
                filterRange: {min, max},
            });
        }
    };

    getNextFilteredData = (data: FundData[], indices: number[]) => {

        let nextMutatedData = [];

        if (indices.length > 0) {
            indices.forEach((index) => {
                nextMutatedData.push(data[index]);
            });
        } else {
            nextMutatedData = [...data];
        }

        return nextMutatedData
    };

    filterData2 = (indices: number[]) => {
        const {data, filterIndices} = this.state;

        console.log(indices);

        // Only re-set state if filter changes
        if (indices.length === 0
            || indices.some((index, i) => index !== filterIndices[i])) {
            this.setState({
                mutatedData: this.getNextFilteredData(data, indices),
                filterIndices: [...indices],
            });
        }
    };

    /**
     * When sorting data, we should sort the unfiltered data to prevent data
     * jumping around when filters are unset
     * */
    sortData = (sortKey: string, asc: boolean) => {
        const {data, mutatedData, filterIndices} = this.state;

        /*const sortedData = sortData(data, sortKey);
        if (sortedData) {
            const nextMutatedData = filterData(sortedData, mutatedData,
                filterRange.min, filterRange.max, true);

            this.setState(prevState => ({
                data: [...sortedData],
                mutatedData: nextMutatedData || prevState.mutatedData,
            }));
        }*/

        if (data[0].sortIndices[sortKey]) {
            // Sort index exists

            const dir = asc ? 'asc' : 'des';

            const sortedData = [];
            data.forEach((fundData) => {
                sortedData[fundData.sortIndices[sortKey][dir]] = {...fundData};
            });

            const nextMutatedData = this.getNextFilteredData(sortedData, filterIndices);

            this.setState(prevState => ({
                data: [...sortedData],
                mutatedData: nextMutatedData || prevState.mutatedData,
            }));
        }
    };

    changeChartComponentColor = (asset: string, newColor: string) => {
        this.setState((prevState: AppStates) => ({
            colorData: {
                assets: {
                    ...prevState.colorData.assets,
                    [asset]: newColor || prevState.colorData.assets[asset],
                },
                assetLvls: {...prevState.colorData.assetLvls},
            },
        }));
    };

    handleChartElClicked = (fundData: FundData) => {
        // console.log(JSON.stringify(fundData));
        this.setState((prevState: AppStates) => ({
            mainChartElClickedFlag: !prevState.mainChartElClickedFlag,
            lastClickedFundData: {...fundData},
        }));
    };

    render() {
        const {
            chartKey, data, mutatedData, colorData, mainChartElClickedFlag,
            lastClickedFundData,
        } = this.state;

        // Note that keys MUST be unique among siblings

        return (
            <div id="app">
                <section>
                    <Intro />
                </section>
                <section>
                    <LoadableControlPanel key={`CP-${chartKey.toString()}`}
                                          fundsCount={data.length}
                                          logStatusMsg={this.logStatusMsg}
                                          setNewData={this.setNewData}
                                          filterData={this.filterData}
                                          filterData2={this.filterData2}
                                          sortData={this.sortData} />
                </section>
                <section>
                    <LoadableAnalytics key={`An-${chartKey.toString()}`}
                                       size={assetsChartSize}
                                       data={lastClickedFundData}
                                       colorData={colorData} />
                    <LoadableChart key={`Ch-${chartKey.toString()}`}
                                   chartSize={mainChartSize}
                                   data={mutatedData}
                                   colorData={colorData}
                                   mainChartElClickedFlag={mainChartElClickedFlag}
                                   handleChartElClicked={this.handleChartElClicked}>
                        <LoadableLegend key={`Le-${chartKey.toString()}`}
                                        data={mutatedData}
                                        colorData={colorData}
                                        changeChartComponentColor={this.changeChartComponentColor} />
                    </LoadableChart>
                </section>
            </div>
        )
    }
}
