// @flow

import * as React from 'react';

import type {FundData} from './DataTypes';
import FilterSlider from './FilterSlider';

type FilterChartProps = {
    filterData: (min: number, max: number) => void;
};

export default class FilterChart extends React.PureComponent<FilterChartProps, {}> {
    setFilterRange = (min: number, max: number) => {
        const {filterData} = this.props;

        filterData(min, max);
    };

    render() {
        return (
            <div id="cp-filter" draggable={false}>
                <div className="title" draggable={false}>
                    FILTER
                </div>
                <div className="description" draggable={false}>
                    Filter data range by dragging the slider below
                </div>
                <FilterSlider
                    size={{
                        longBar: {width: 200, height: 10},
                        stopBar: {width: 10, height: 20},
                    }}
                    setFilterRange={this.setFilterRange} />
            </div>
        )
    }
}
