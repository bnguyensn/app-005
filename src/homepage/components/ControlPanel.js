// @flow

import * as React from 'react';

import SortChart from './SortChart';
import UploadData from './UploadData';

import type {FundData} from './DataTypes';

import '../css/control-panel.css';

type ControlPanelProps = {
    updateFundData: (data: FundData) => void,
};

export default class ControlPanel extends React.PureComponent<ControlPanelProps, {}> {
    render() {
        const {updateFundData} = this.props;

        return (
            <div id="control-panel">
                <span>CONTROL PANEL</span>
                <UploadData updateFundData={updateFundData} />
                <SortChart />
            </div>
        )
    }
}
