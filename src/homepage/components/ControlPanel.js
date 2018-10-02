// @flow

import * as React from 'react';

import UploadData from './UploadData';
import SortChart from './SortChart';
import FilterChart from './FilterChart';

import type {FundData} from './DataTypes';

import '../css/control-panel.css';

type ControlPanelProps = {
    setNewData: (data: FundData[]) => void,
    filterData: (min: number, max: number) => void,
    sortData: (sortKey: string) => void,
};

export default class ControlPanel extends React.PureComponent<ControlPanelProps, {}> {
    render() {
        const {setNewData, sortData, filterData} = this.props;

        return (
            <div id="control-panel">
                <section className="cp-section">
                    <UploadData setNewData={setNewData} />
                </section>
                <section className="cp-section">
                    <FilterChart filterData={filterData} />
                    <SortChart sortData={sortData} />
                </section>

            </div>
        )
    }
}
