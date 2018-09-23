// @flow

import * as React from 'react';

import SortChart from './SortChart';

import '../css/control-panel.css';

export default class ControlPanel extends React.PureComponent<{}, {}> {
    render() {
        return (
            <div id="control-panel">
                <span>CONTROL PANEL</span>
                <SortChart />
            </div>
        )
    }
}
