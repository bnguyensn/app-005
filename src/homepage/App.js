// @flow

import * as React from 'react';
import Loadable from 'react-loadable';
import {Router, Link} from '@reach/router';

import Loading from './app-components/Loading';
import Header from './app-components/Header';

import {mainChartSize, assetsChartSize, gcChartSize}
    from './visualise/chartSizes';

import type {ColorData, FundData} from './data/DataTypes';
import type {MainChartSize, AssetsChartSize, GCChartSize}
    from './visualise/chartSizes';

import defaultData from './data/json/default-data';
import defaultColorData from './data/json/default-color-data';

import './app.css';
import type {MiscCheckboxes} from './visualise/control-panel/Misc';

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

type AppStates = {
    // Used to "hard reset" components upon receipt of new data
    dataKey: boolean,

    data: ?FundData[],
    colorData: ?ColorData,
    mutatedData: ?FundData[],
    mutatedColorData: ?ColorData,

    sizes: {
        mainChartSize: MainChartSize,
        assetsChartSize: AssetsChartSize,
        gcChartSize: GCChartSize,
    },

    curFund: number,  // Currently focused fund id

    // VISUALISE's control panel
    filterStr: string,
    filterIndices: number[],
    sortKey: string,
    sortAsc: boolean,
    miscCheckboxes: MiscCheckboxes,
};

export default class App extends React.PureComponent<{}, AppStates> {
    constructor(props: {}) {
        super(props);

        this.state = {
            dataKey: false,
            data: defaultData,
            colorData: defaultColorData,
            mutatedData: [...defaultData],
            mutatedColorData: {...defaultColorData},
            sizes: {mainChartSize, assetsChartSize, gcChartSize},
            curFund: -1,
            filterStr: '',
            filterIndices: Array.from(Array(defaultData.length).keys()),
            sortKey: '',
            sortAsc: true,
            miscCheckboxes: {
                weightedAssets: false,
            },
        };
    }

    /** ********** DATA'S ********** **/

    setNewData = (data: FundData[], colorData: ColorData) => {
        this.setState((prevState: AppStates) => ({
            dataKey: !prevState.dataKey,
            data: [...data],
            colorData: {...colorData},
            mutatedData: [...data],
            mutatedColorData: {...colorData},
            sizes: {mainChartSize, assetsChartSize, gcChartSize},
            curFund: -1,
            filterStr: '',
            filterIndices: Array.from(Array(defaultData.length).keys()),
            sortKey: '',
            sortAsc: true,
        }));
    };

    /** ********** VISUALISE'S ********** **/

    mutateData = (newMutatedData: FundData[], sideEffects: {}) => {
        this.setState({
            mutatedData: newMutatedData,
            ...sideEffects,  // Side effects MUST conform with AppStates
        });
    };

    changeColorData = (type: string, name: string, newColor: string) => {
        const {mutatedColorData} = this.state;

        if (newColor && mutatedColorData) {
            if (type === 'assets') {
                this.setState({
                    mutatedColorData: {
                        assets: {
                            ...mutatedColorData.assets,
                            [name]: newColor,
                        },
                        assetLvls: {...mutatedColorData.assetLvls},
                    },
                });
            } else if (type === 'assetLvls') {
                this.setState({
                    mutatedColorData: {
                        assets: {...mutatedColorData.assets},
                        assetLvls: {
                            ...mutatedColorData.assetLvls,
                            [name]: newColor,
                        },
                    },
                });
            }
        }
    };

    changeSize = (chart: string, newSize: {}) => {

    };

    onFundClick = (fundData: FundData) => {
        this.setState({
            curFund: fundData.id,
        })
    };

    changeFilterStr = (newFilterStr: string) => {
        this.setState({
            filterStr: newFilterStr,
        });
    };

    filterData = (indices: number[]) => {
        const {data} = this.state;

        if (data) {
            const newMutatedData = indices.length > 0
                ? indices.map(fundIndex => data[fundIndex])
                : [...data];

            const sideEffects = {
                filterIndices: indices,
            };

            this.mutateData(newMutatedData, sideEffects);
        }
    };

    sortData = (sortKey: string, asc: boolean) => {

    };

    changeMiscCheckboxes = (name: string) => {

    };

    /** ********** RENDER ********** **/

    render() {
        return (
            <div id="app">
                <Header />
                <Router>
                    <LoadableIntro path="/" />
                    <LoadableData path="/data"
                                  setNewData={this.setNewData} />
                    <LoadableVisualise path="/visualise"
                                       changeColorData={this.changeColorData}
                                       changeSize={this.changeSize}
                                       onFundClick={this.onFundClick}
                                       changeFilterStr={this.changeFilterStr}
                                       filterData={this.filterData}
                                       sortData={this.sortData}
                                       changeMiscCheckboxes={
                                           this.changeMiscCheckboxes
                                       }
                                       {...this.state} />
                </Router>
            </div>
        )
    }
}
