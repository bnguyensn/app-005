// @flow

import * as React from 'react';

import UploadData from './UploadData';
import Filter from './Filter';
import Sort from './Sort';
import Misc from './Misc';

import type {FundData} from '../DataTypes';
import type {MiscCheckboxes} from './Misc';

import './control-panel.css';

type ControlPanelProps = {
    fundsCount: number,
    logStatusMsg: (msg: string) => void,
    setNewData: (data: FundData[]) => void,

    filterData: (min: number, max: number) => void,
    filterData2: (indices: number[]) => void,

    sortData: (sortKey: string, asc: boolean) => void,

    miscCheckboxes: MiscCheckboxes,
    changeCheckbox: (name: string) => void,
};

export default class ControlPanel extends React.PureComponent<ControlPanelProps, {}> {
    render() {
        const {
            fundsCount, logStatusMsg, setNewData,
            filterData, filterData2,
            sortData,
            miscCheckboxes, changeCheckbox,
        } = this.props;

        return (
            <div id="control-panel">
                <section className="cp-section">
                    <UploadData logStatusMsg={logStatusMsg}
                                setNewData={setNewData} />
                </section>

                <section className="cp-section">
                    <Filter fundsCount={fundsCount}
                            filterData={filterData}
                            filterData2={filterData2} />
                    <Sort sortData={sortData}
                          miscCheckboxes={miscCheckboxes} />
                    <Misc miscCheckboxes={miscCheckboxes}
                          changeCheckbox={changeCheckbox} />
                </section>
            </div>
        )
    }
}
