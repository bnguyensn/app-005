// @flow

import * as React from 'react';

import UploadData from './UploadData';
import Sort from './Sort';
import Filter from './Filter';

import type {FundData} from '../DataTypes';

import './control-panel.css';

type ControlPanelProps = {
    logStatusMsg: (msg: string) => void,
    setNewData: (data: FundData[]) => void,
    filterData: (min: number, max: number) => void,
    sortData: (sortKey: string) => void,
};

export default class ControlPanel extends React.PureComponent<ControlPanelProps, {}> {
    render() {
        const {logStatusMsg, setNewData, sortData, filterData} = this.props;

        return (
            <div id="control-panel">
                <section className="cp-section">
                    <UploadData logStatusMsg={logStatusMsg}
                                setNewData={setNewData} />
                </section>
                <section className="cp-section">
                    <Filter filterData={filterData} />
                    <Sort sortData={sortData} />
                </section>

            </div>
        )
    }
}
