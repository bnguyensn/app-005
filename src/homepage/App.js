// @flow

import * as React from 'react';

import ControlPanel from './components/ControlPanel';
import Chart from './components/Chart';

import type {FundData, ColorData} from './components/DataTypes';

import './app.css';

import sampleData from './json/sample-01';
import sampleColorData from './json/sample-colors-01';

const chartMargin = {top: 50, right: 50, bottom: 50, left: 50};
const chartSize = {
    width: 640 - chartMargin.left - chartMargin.right,
    height: 640 - chartMargin.top - chartMargin.bottom,
    marginTop: 50,
    marginRight: 50,
    marginBottom: 50,
    marginLeft: 50,
};

type AppStates = {
    chartKey: boolean,
    data: FundData[],
    colorData: ColorData,
}

export default class App extends React.PureComponent<{}, AppStates> {
    defaultData: FundData[];

    constructor(props: {}) {
        super(props);
        this.defaultData = [...sampleData];
        this.state = {
            chartKey: false,  // Used to "reset" the chart element via the "key" prop
            data: [...sampleData],
            colorData: sampleColorData,
        };
    }

    componentDidMount() {
        // Fetch data
    }

    /**
     * Called when a new dataset is uploaded. This resets the chart element via
     * changing its "key" prop.
     * */
    setNewData = (data: FundData[]) => {
        this.defaultData = [...data];
        this.setState((prevState: AppStates) => ({
            chartKey: !prevState.chartKey,
            data: [...data],
        }));
    };

    /**
     * Called after "mutation" functions such as filter or sort. This does not
     * reset the chart element. It merely pass on the filtered / sorted data
     * and let d3js handle the "rendering" part.
     * */
    updateData = (data: FundData[]) => {
        this.setState({
            data: [...data],
        });
    };

    render() {
        const {chartKey, data, colorData} = this.state;

        return (
            <div id="app">
                Chart

                <ControlPanel defaultData={this.defaultData}
                              currentData={data}
                              setNewData={this.setNewData}
                              updateData={this.updateData} />

                <hr />

                <Chart key={chartKey.toString()}
                       defaultData={data}
                       defaultColorData={colorData}
                       chartSize={chartSize} />
            </div>
        )
    }
}
