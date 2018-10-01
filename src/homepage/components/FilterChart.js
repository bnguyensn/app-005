// @flow

import * as React from 'react';

import type {FundData} from './DataTypes';
import FilterSlider from './FilterSlider';

type FilterChartProps = {
    defaultData: FundData[],
    currentData: FundData[],
    updateData: (data: FundData[]) => void,
};

export default class FilterChart extends React.PureComponent<FilterChartProps, {}> {
    setFilterRange = (min: number, max: number) => {
        const {defaultData, currentData, updateData} = this.props;

        const ogDataCount = defaultData.length;
        const curDataCount = currentData.length;

        const filteredData = defaultData.filter((d, i) => (
            (i + 1) >= Math.ceil(min * ogDataCount)
            && (i + 1) <= Math.ceil(max * ogDataCount)
        ));

        if (curDataCount !== filteredData.length) {
            updateData(filteredData);
        }
    };

    render() {
        const {defaultData} = this.props;

        return (
            <div id="cp-filter" className="cp-section">
                <div className="cp-section-title">
                    FILTER
                </div>
                <div className="cp-section-description">
                    Filter data range by dragging the slider below
                </div>
                <FilterSlider
                    key={JSON.stringify(defaultData)}
                    size={{
                        longBar: {width: 200, height: 10},
                        stopBar: {width: 10, height: 20},
                    }}
                    defaultData={defaultData}
                    setFilterRange={this.setFilterRange} />
            </div>
        )
    }
}
