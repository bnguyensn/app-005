// @flow

import * as React from 'react';
import BarChart from './components/BarChart';
import './app.css';

/** ********** MAIN COMPONENT ********** **/

const data = [5, 10, 1, 3];
const barSize = 25;
const chartMargin = {top: 50, right: 50, bottom: 50, left: 50};
const chartSize = {
    width: 640 - chartMargin.left - chartMargin.right,
    height: 640 - chartMargin.top - chartMargin.bottom,
};

export default function App() {
    return (
        <div id="app">
            <BarChart data={data}
                      barSize={barSize}
                      chartMargin={chartMargin}
                      chartSize={chartSize} />
        </div>

    )
}
