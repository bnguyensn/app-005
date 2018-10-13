// @flow

import * as React from 'react';

import SortSelection from './SortSelection';

import type {MiscCheckboxes} from '../Misc';

import './sort.css';

type SortProps = {
    sortKey: string,
    sortAsc: boolean,
    miscCheckboxes: MiscCheckboxes,
    sortData: (sortKey: string, asc: boolean) => void,
}

export default class Sort extends React.PureComponent<SortProps, {}> {
    handleSelect = (e: SyntheticInputEvent<HTMLSelectElement>) => {
        const {miscCheckboxes, sortData} = this.props;

        const selectedVal = e.target.value;

        const w = miscCheckboxes.weightedAssets;
        const asc = selectedVal.slice(0, 1) === 'a';
        const sortKeyNoW = selectedVal.slice(2);

        if (sortKeyNoW === 'goingConcern' || sortKeyNoW === 'totalAssets') {
            const sortKey = w ? `${sortKeyNoW}W` : sortKeyNoW;
            sortData(sortKey, asc);
        } else {
            sortData(sortKeyNoW, asc);
        }
    };

    render() {
        const {sortData, miscCheckboxes} = this.props;

        return (
            <div id="main-chart-control-panel-sort">
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
