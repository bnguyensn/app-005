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
            <div id="cp-filter-chart" className="cp-section">
                <FilterSlider defaultData={defaultData}
                              updateData={updateData} />
            </div>
        )
    }
}
