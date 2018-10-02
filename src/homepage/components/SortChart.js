// @flow

import * as React from 'react';

type SortChartProps = {
    sortData: (sortKey: string) => void,
};

export default class SortChart extends React.PureComponent<SortChartProps, {}> {
    handleSelect = (e: SyntheticInputEvent<HTMLSelectElement>) => {
        const {sortData} = this.props;

        const selectedVal = e.target.value;
        const selectedDispVal = e.target.options[e.target.selectedIndex].text;

        sortData(selectedVal);
    };

    render() {
        return (
            <div id="cp-sort"
                 draggable={false}>
                <div className="title"
                     draggable={false}>
                    SORT
                </div>
                <div className="description"
                     draggable={false}>
                    Sort data by selecting an option below
                </div>
                <label htmlFor="sort-chart-select"
                       draggable={false}>
                    <select id="sort-chart-select"
                            draggable={false}
                            onChange={this.handleSelect}>
                        <option value="name">Fund name</option>
                        <option value="goingConcern">Going concern</option>
                        <option value="remFCom">Remaining calls from investments</option>
                        <option value="totalAssets">Total assets</option>
                    </select>
                </label>
            </div>
        )
    }
}
