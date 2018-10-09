// @flow

import * as React from 'react';

import FilterSlider from './FilterSlider';

type FilterChartProps = {
    filterData: (min: number, max: number) => void,
};

export default class Filter extends React.PureComponent<FilterChartProps, {}> {
    setFilterRange = (min: number, max: number) => {
        const {filterData} = this.props;

        filterData(min, max);
    };

    render() {
        return (
            <div className="cp-filter" draggable={false}>
                <div className="title" draggable={false}>
                    FILTER
                </div>
                <div className="description" draggable={false}>
                    Filter data by typing in the input below. Use commas &#8220; &#44; &#8221;
                    to separate filters.
                </div>

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
