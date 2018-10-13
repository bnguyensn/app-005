// @flow

import * as React from 'react';

import {addToIndices, addToRanges, addToRangesP, rangesToIndices}
    from './helpers';

import './filter.css';

type FilterProps = {
    fundsCount: number,
    filterStr: string,
    filterIndices: number[],
    changeFilterStr: (newFilterStr: string) => void,
    filterData: (indices: number[]) => void,
};

export default class Filter extends React.PureComponent<FilterProps, {}> {
    handleInputChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const {
            fundsCount, filterStr, filterIndices,
            changeFilterStr, filterData,
        } = this.props;

        const s1 = e.target.value;

        let newFilterStr = '';
        let newFilterIndices = [...filterIndices];

        if (s1) {
            // ***** New string is not an empty string ***** //

            // ***** Restrict input ***** //

            // Check for anything that's neither a digit, " ", "-", "%", or ","

            const regex1 = /[^\d\s%\-,]/g;
            const match1 = s1.match(regex1);

            if (!match1) {
                newFilterStr = s1;

                // ***** Obtain an array of index / index ranges ***** //

                // Trim all whitespaces
                const s2 = s1.replace(/\s/g, '');

                // Delimit using "," and remove duplicates
                const s2Arrs = [...new Set(s2.split(','))];

                // Remove all invalid strings
                const s3Arrs = s2Arrs.filter(s => (
                    // 1, 1-2, 1%-2%
                    s && s.match(/^\d+%-\d+%$|^\d+-\d+$|^\d+$/g)
                ));

                if (s3Arrs.length > 0) {
                    // ***** Convert to indices ***** //

                    const indexLimit = fundsCount - 1;

                    const indices = new Set();
                    const ranges = [];

                    s3Arrs.forEach((s) => {
                        if (s.indexOf('-') > -1) {
                            if (s.indexOf('%') > -1) {
                                // This is a % range

                                const digits = s.match(/\d+/g);

                                if (digits) {
                                    const rP = digits.map(str => (
                                        parseInt(str, 10)
                                    ));

                                    if (rP[0] < rP[1]) {
                                        addToRangesP(indexLimit, ranges, rP);
                                    } else if (rP[0] > rP[1]) {
                                        addToRangesP(indexLimit, ranges,
                                            rP.reverse());
                                    } else {
                                        const i = Math.ceil(
                                            (rP[0] / 100) * indexLimit,
                                        );
                                        addToIndices(indexLimit, indices, i);
                                    }
                                }
                            } else {
                                // This is a normal range

                                const digits = s.match(/\d+/g);

                                if (digits) {
                                    const r = digits.map(str => (
                                        parseInt(str, 10)
                                    ));
                                    if (r[0] < r[1]) {
                                        addToRanges(indexLimit, ranges, r,
                                            true);
                                    } else if (r[0] > r[1]) {
                                        addToRanges(indexLimit, ranges,
                                            r.reverse(), true);
                                    } else {
                                        addToIndices(indexLimit, indices, r[0]);
                                    }
                                }
                            }
                        } else {
                            // This is a single number

                            const digits = s.match(/\d+/g);

                            if (digits) {
                                const i = digits.map(str => (
                                    parseInt(str, 10)
                                ))[0];
                                addToIndices(indexLimit, indices, i);
                            }
                        }
                    });

                    rangesToIndices(ranges, indices);

                    newFilterIndices = Array.from(indices).sort(
                        (a, b) => a - b,
                    );
                }
            }
        } else {
            newFilterIndices = [];
        }

        // ***** Perform updates (only if there have been changes) ***** //

        // ***** Update filter string ***** //

        if (filterStr !== newFilterStr) {
            changeFilterStr(newFilterStr);

            // ***** Update filter indices ***** //

            if (newFilterIndices.length !== filterIndices.length
                || newFilterIndices.some(
                    (fundIndex, i) => fundIndex !== filterIndices[i],
                )) {
                filterData(newFilterIndices);
            }
        }
    };

    render() {
        const {filterStr} = this.props;

        return (
            <div id="main-chart-control-panel-filter">
                <input type="text"
                       placeholder="e.g. 1, 3 - 4, 50% - 100%"
                       value={filterStr}
                       onChange={this.handleInputChange} />
            </div>
        )
    }
}
