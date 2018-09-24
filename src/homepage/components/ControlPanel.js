// @flow

import * as React from 'react';

import SortChart from './SortChart';

import '../css/control-panel.css';
import UploadData from './UploadData';

type ControlPanelProps = {
    updateData: () => void,
};

export default class ControlPanel extends React.PureComponent<ControlPanelProps, {}> {
    render() {
        const {updateData} = this.props;

        return (
            <div id="control-panel">
                <span>CONTROL PANEL</span>
                <UploadData updateData={updateData} />
                <SortChart />
            </div>
        )
    }
}
