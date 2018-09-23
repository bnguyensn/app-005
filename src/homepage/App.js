// @flow

import * as React from 'react';

import Chart from './components/Chart';
import type {FundData, ColorData} from './components/DataTypes';

import './app.css';

import sampleData from './json/sample-01';
import sampleColorData from './json/sample-colors-01';

/** ********** MAIN COMPONENT ********** **/

const barSize = 25;
const chartMargin = {top: 50, right: 50, bottom: 50, left: 50};
const chartSize = {
    width: 640 - chartMargin.left - chartMargin.right,
    height: 640 - chartMargin.top - chartMargin.bottom,
};

type AppStates = {
    data: FundData[],
    colorData: ColorData,
}

export default class App extends React.PureComponent<{}, AppStates> {
    constructor(props: {}) {
        super(props);
        this.state = {
            data: sampleData,
            colorData: sampleColorData,
        };
    }

    componentDidMount() {
        // Fetch data
    }

    render() {
        const {data, colorData} = this.state;

        return (
            <div id="app">
                Chart

                <hr />

                <Chart data={data}
                       colorData={colorData}
                       barSize={barSize}
                       chartMargin={chartMargin}
                       chartSize={chartSize} />
            </div>
        )
    }
}
