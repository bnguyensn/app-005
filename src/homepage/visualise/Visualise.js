// @flow

import * as React from 'react';

import Page from '../app-components/Page';
import Chart from './main-chart/Chart';

import type {ColorData, FundData} from '../data/DataTypes';
import type {MiscCheckboxes} from './control-panel/Misc';
import type {MainChartSize, AssetsChartSize, GCChartSize} from './chartSizes';

import './visualise.css';
import ControlPanel from './control-panel/ControlPanel';

type VisualiseProps = {
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

    curFund: number,  // Currently selected fund's id

    filterStr: string,
    filterIndices: number[],
    sortKey: string,
    sortAsc: boolean,
    miscCheckboxes: MiscCheckboxes,

    changeColorData: (name: string, newColor: string) => void,
    changeSize: (chart: string, newSize: {}) => void,
    onFundClick: (FundData) => void,
    changeFilterStr: (newFilterStr: string) => void,
    filterData: (indices: number[]) => void,
    sortData: (sKey: string, asc: boolean) => void,
    changeMiscCheckboxes: (name: string) => void,
}

export default class Visualise
    extends React.PureComponent<VisualiseProps, {}> {
    render() {
        const {
            dataKey, data, colorData, mutatedData, mutatedColorData,
            sizes,
            curFund, filterStr, filterIndices, sortKey, sortAsc, miscCheckboxes,
            changeColorData, changeSize, onFundClick,
            changeFilterStr, filterData, sortData, changeMiscCheckboxes,
        } = this.props;

        return (
            <Page id="visualise">
                <section>
                    <ControlPanel data={data}
                                  filterStr={filterStr}
                                  filterIndices={filterIndices}
                                  sortKey={sortKey}
                                  sortAsc={sortAsc}
                                  miscCheckboxes={miscCheckboxes}
                                  changeFilterStr={changeFilterStr}
                                  filterData={filterData}
                                  sortData={sortData}
                                  changeMiscCheckboxes={changeMiscCheckboxes} />
                </section>
                <section id="visualise-main">
                    <Chart dataKey={dataKey}
                           data={mutatedData}
                           colorData={mutatedColorData}
                           miscCheckboxes={miscCheckboxes}
                           size={sizes.mainChartSize}
                           curFund={0}
                           changeColorData={changeColorData}
                           changeSize={changeSize}
                           onFundClick={onFundClick} />
                </section>
            </Page>
        )
    }
}
