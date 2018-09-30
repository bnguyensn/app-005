// @flow

import * as React from 'react';

import type {FundData} from './DataTypes';
import FilterSlider from './FilterSlider';

type FilterChartProps = {
    defaultData: FundData[],
    updateData: (data: FundData[]) => void,
};

export default class FilterChart extends React.PureComponent<FilterChartProps, {}> {
    render() {
        const {defaultData, updateData} = this.props;

        return (
            <div id="cp-filter" className="cp-section">
                <div className="cp-section-title">
                    FILTER
                </div>
                <div className="cp-section-description">
                    Filter data range by dragging the slider below
                </div>
                <FilterSlider size={{
                    longBar: {width: 200, height: 10},
                    stopBar: {width: 10, height: 20},
                }}
                              defaultData={defaultData}
                              updateData={updateData} />
            </div>
        )
    }
}
