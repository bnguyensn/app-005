// @flow

import * as React from 'react';
import BarChart from './components/BarChart';
import './app.css';

/** ********** MAIN COMPONENT ********** **/

const data = [5, 10, 1, 3];
const barSize = 25;
const chartSize = {
    width: 500,
    height: 500,
};

export default function App() {
    return (
        <div id="app">
            <BarChart data={data}
                      barSize={barSize}
                      chartSize={chartSize} />
        </div>

    )
}
