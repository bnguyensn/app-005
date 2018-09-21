// @flow

import * as React from 'react';
import BarChart from './components/BarChart';
import type {FundData} from './components/DataTypes';
import './app.css';
import sampleData from './json/sample-01';

/** ********** MAIN COMPONENT ********** **/

const barSize = 25;
const chartMargin = {top: 50, right: 50, bottom: 50, left: 50};
const chartSize = {
    width: 640 - chartMargin.left - chartMargin.right,
    height: 640 - chartMargin.top - chartMargin.bottom,
};

type AppStates = {
    data: FundData[],
}

export default class App extends React.PureComponent<{}, AppStates> {
    constructor(props: {}) {
        super(props);
        this.state = {
            data: sampleData,
        };
    }

    componentDidMount() {
        // Fetch data
    }

    render() {
        return (
            <div id="app">
                Chart element below:

                <hr />

                <BarChart data={sampleData}
                          barSize={barSize}
                          chartMargin={chartMargin}
                          chartSize={chartSize} />
            </div>
        )
    }
}
