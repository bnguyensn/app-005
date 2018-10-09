// @flow

import * as React from 'react';

import FilterSlider from './FilterSlider';
import FilterTextInput from './FilterTextInput';

type FilterChartProps = {
    fundsCount: number,
    filterData: (min: number, max: number) => void,
    filterData2: (indices: number[]) => void,
};

export default class Filter extends React.PureComponent<FilterChartProps, {}> {
    setFilterRange = (min: number, max: number) => {
        const {filterData} = this.props;

        filterData(min, max);
    };

    render() {
        const {fundsCount, filterData2} = this.props;

        return (
            <div className="cp-filter cp-subsection-320">
                <div className="title">
                    FILTER
                </div>
                <div className="description">
                    Filter data by typing in the input below. Use commas &#8220; &#44; &#8221;
                    to separate filters.
                </div>
                <FilterTextInput filterData={filterData2}
                                 fundsCount={fundsCount} />

                {/*<FilterSlider*/}
                {/*size={{*/}
                {/*longBar: {width: 200, height: 10},*/}
                {/*stopBar: {width: 10, height: 20},*/}
                {/*}}*/}
                {/*setFilterRange={this.setFilterRange} />*/}
            </div>
        )
    }
}
