// @flow

import * as React from 'react';

type SortChartProps = {
    sortData: (sortKey: string, asc: boolean) => void,
};

export default class SortSelection extends React.PureComponent<SortChartProps, {}> {
    handleSelect = (e: SyntheticInputEvent<HTMLSelectElement>) => {
        const {sortData} = this.props;

        const selectedVal = e.target.value;
        const asc = selectedVal.slice(0, 1) === 'a';
        const sortKey = selectedVal.slice(2);

        sortData(sortKey, asc);
    };

    render() {
        return (
            <div className="cp-sort cp-subsection-320">
                <label htmlFor="sort-chart-select">
                    <select id="sort-chart-select"
                            onChange={this.handleSelect}>
                        <option value="n/a">-- Select a sort option --</option>
                        <option value="a_name">Fund name (asc.)</option>
                        <option value="d_name">Fund name (desc.)</option>
                        <option value="a_goingConcern">Going concern (asc.)</option>
                        <option value="d_goingConcern">Going concern (desc.)</option>
                        <option value="a_remFCom">Remaining calls from investments (asc)</option>
                        <option value="d_remFCom">Remaining calls from investments (desc.)</option>
                        <option value="a_totalAssets">Total assets (asc.)</option>
                        <option value="d_totalAssets">Total assets (desc.)</option>
                    </select>
                </label>
            </div>
        )
    }
}
