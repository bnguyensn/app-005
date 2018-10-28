// @flow

import * as React from 'react';

import createChordData from '../../main-chart/chart-funcs/createChordData';
import {createUpdatesNewData} from '../../stages/createUpdates';

import type {SheetNames} from '../../data/xlsx/readWorkbook';
import type {ChartData, ColorScale, DataAll, DataConfig}
    from '../../data/Types';
import type {ArcChartSize} from '../../chartSizes';

import './switch-sheet.css';

type SwitchSheetProps = {
    dataAll: DataAll,
    sheetNames: SheetNames,
    colorScale: ColorScale,
    chartData: ChartData,
    dataConfig: DataConfig,
    size: ArcChartSize,
    changeStates: ({}) => void,
}

export default class SwitchSheet
    extends React.PureComponent<SwitchSheetProps, {}> {
    handleSelect = (e: SyntheticInputEvent<HTMLSelectElement>) => {
        const {
            dataAll, sheetNames, colorScale,
            chartData, dataConfig, size,
            changeStates,
        } = this.props;

        const newSheet = Number(e.currentTarget.value);

        const data = dataAll[sheetNames[newSheet]]
            .dataInfo.dataExtended[dataConfig.dataType];
        const newChartData = {
            cur: createChordData(data),
            prev: chartData.cur,
        };

        const newUpdates = createUpdatesNewData(
            data, null,
            newChartData.cur, newChartData.prev,
            dataAll[sheetNames[newSheet]].nameData, colorScale,
            size,
        );

        changeStates({
            dataConfig: {
                ...dataConfig,
                curSheet: newSheet,
            },
            chartData: newChartData,
            updates: newUpdates,
        });
    };

    render() {
        const {sheetNames, dataConfig} = this.props;

        const options = sheetNames.map((sheetName, i) => (
            <option key={sheetName}
                    value={i}>
                {sheetName}
            </option>
        ));

        return (
            <div id="switch-sheet">
                <label htmlFor="switch-sheet-select">
                    <select id="switch-sheet-select"
                            defaultValue={dataConfig.curSheet}
                            onChange={this.handleSelect}>
                        {options}
                    </select>
                </label>
            </div>
        )
    }
}
