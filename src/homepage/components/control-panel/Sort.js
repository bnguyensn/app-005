// @flow

import * as React from 'react';

import SortSelection from './SortSelection';

type SortProps = {
    sortData: (sortKey: string, asc: boolean) => void,
}

export default class Sort extends React.PureComponent<SortProps, {}> {
    render() {
        const {sortData} = this.props;

        return (
            <div className="cp-sort cp-subsection-320">
                <div className="title">
                    SORT
                </div>
                <div className="description">
                    Sort data by selecting an option below
                </div>
                <SortSelection sortData={sortData} />
            </div>
        )
    }
}
