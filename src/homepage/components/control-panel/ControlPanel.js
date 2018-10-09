// @flow

import * as React from 'react';

import UploadData from './UploadData';
import Sort from './Sort';
import Filter from './Filter';

import type {FundData} from '../DataTypes';

import './control-panel.css';
import FilterTextInput from './FilterTextInput';
import SortSelection from './SortSelection';

type ControlPanelProps = {
    fundsCount: number,
    logStatusMsg: (msg: string) => void,
    setNewData: (data: FundData[]) => void,
    filterData: (min: number, max: number) => void,
    filterData2: (indices: number[]) => void,
    sortData: (sortKey: string, asc: boolean) => void,
};

export default class ControlPanel extends React.PureComponent<ControlPanelProps, {}> {
    render() {
        const {
            fundsCount, logStatusMsg, setNewData, sortData, filterData,
            filterData2,
        } = this.props;

        return (
            <div id="control-panel">
                <section className="cp-section">
                    <UploadData logStatusMsg={logStatusMsg}
                                setNewData={setNewData} />
                </section>

                <section className="cp-section">
                    <Filter filterData={filterData} />
                    <Sort />
                </section>

                <section className="cp-section">
                    <FilterTextInput filterData2={filterData2}
                                     fundsCount={fundsCount} />
                    <SortSelection sortData={sortData} />
                </section>
            </div>
        )
    }
}
