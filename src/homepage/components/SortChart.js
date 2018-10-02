// @flow

import * as React from 'react';

export default class SortChart extends React.PureComponent<{}, {}> {
    render() {
        return (
            <div id="cp-sort" draggable={false}>
                <div className="title" draggable={false}>
                    SORT
                </div>
                <div className="description" draggable={false}>
                    Sort data by selecting an option below
                </div>
                <label htmlFor="sort-chart-select" draggable={false}>
                    <select id="sort-chart-select" draggable={false}>
                        <option value="name">Fund name</option>
                        <option value="goingconcern">Going concern</option>
                        <option value="fcalrem">Remaining calls from investments</option>
                        <option value="totalassets">Total assets</option>
                    </select>
                </label>
            </div>
        )
    }
}
