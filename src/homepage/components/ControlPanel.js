// @flow

import * as React from 'react';

import UploadData from './UploadData';
import SortChart from './SortChart';
import FilterChart from './FilterChart';

import type {FundData} from './DataTypes';

import '../css/control-panel.css';

type ControlPanelProps = {
    defaultData: FundData[],
    setNewData: (data: FundData[]) => void,
    updateData: (data: FundData[]) => void,
};

export default class ControlPanel extends React.PureComponent<ControlPanelProps, {}> {
    render() {
        const {defaultData, setNewData, updateData} = this.props;

        return (
            <div id="control-panel">
                <span>CONTROL PANEL</span>
                <UploadData setNewData={setNewData} />
                <SortChart />
                <FilterChart defaultData={defaultData}
                             updateData={updateData} />
            </div>
        )
    }
}
