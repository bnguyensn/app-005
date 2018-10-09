// @flow

import * as React from 'react';

export default class Sort extends React.PureComponent<{}, {}> {
    render() {
        return (
            <div className="cp-sort"
                 draggable={false}>
                <div className="title"
                     draggable={false}>
                    SORT
                </div>
                <div className="description"
                     draggable={false}>
                    Sort data by selecting an option below
                </div>
            </div>
        )
    }
}
