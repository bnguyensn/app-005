// @flow

import * as React from 'react';

type R = [number, number];

function addToIndices(indexLimit: number, indices: any, i: number) {
    // Note: indices is a Set

    if (i <= indexLimit) {
        indices.add(i);
    }
}

function addToRanges(indexLimit: number, ranges: R[], r: R) {
    if (r[0] <= indexLimit && r[1] <= indexLimit) {
        ranges.push(r);
    }
}

function addToRangesP(
    indexLimit: number,
    ranges: [number, number][],
    rP: [number, number],
) {
    const r = rP.map((p, index) => (
        index === 0
            ? Math.ceil((p / 100) * indexLimit)
            : Math.floor((p / 100) * indexLimit)
    ));
    addToRanges(indexLimit, ranges, r);
}

function rangesToIndices(ranges: R[], indices: any) {
    ranges.forEach((r) => {
        // Create an array filled with indices
        const arr = Array.from(new Array(r[1] - r[0] + 1), (val, index) => r[0] + index);

        // Simply add these indices to the Set.
        // No need to check for indexLimit here. Everything is within limit
        // when this function is called.
        arr.forEach((val) => {
            indices.add(val);
        });
    });
}

type FilterTextInputProps = {
    fundsCount: number,
    filterData: (filterIndices: number[]) => void,
};

type FilterTextInputStates = {
    filterString: string,
};

export default class FilterTextInput extends React.PureComponent<FilterTextInputProps, FilterTextInputStates> {
    constructor(props: FilterTextInputProps) {
        super(props);
        this.state = {
            filterString: '',
        };
    }

    handleInputChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const {fundsCount, filterData} = this.props;

        const s1 = e.target.value;

        if (s1) {
            // ***** Restrict input ***** //

            // Check for anything that's neither a digit, " ", "-", "%", or ","

            const regex1 = /[^\d\s%\-,]/g;
            const match1 = s1.match(regex1);

            if (!match1) {
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

                console.log(`valid strings: ${s3Arrs}`);

                if (s3Arrs.length > 0) {
                    // ***** Convert to indices ***** //

                    const indexLimit = fundsCount - 1;

                    const indices = new Set();
                    const ranges = [];

                    s3Arrs.forEach((s) => {
                        if (s.indexOf('-') > -1) {
                            if (s.indexOf('%') > -1) {
                                // This is a % range

                                const rP = s.match(/\d+/g).map(str => parseInt(str, 10));
                                if (rP[0] < rP[1]) {
                                    addToRangesP(indexLimit, ranges, rP);
                                } else if (rP[0] > rP[1]) {
                                    addToRangesP(indexLimit, ranges, rP.reverse());
                                } else {
                                    const i = Math.ceil((rP[0] / 100) * indexLimit);
                                    addToIndices(indexLimit, indices, i);
                                }
                            } else {
                                // This is a normal range

                                const r = s.match(/\d+/g).map(str => parseInt(str, 10));
                                if (r[0] < r[1]) {
                                    addToRanges(indexLimit, ranges, r);
                                } else if (r[0] > r[1]) {
                                    addToRanges(indexLimit, ranges, r.reverse());
                                } else {
                                    addToIndices(indexLimit, indices, r[0]);
                                }
                                addToRanges(indexLimit, indices, ranges, r);
                            }
                        } else {
                            // This is a single number

                            const i = (s.match(/\d+/g).map(str => parseInt(str, 10)))[0];
                            addToIndices(indexLimit, indices, i);
                        }
                    });

                    rangesToIndices(ranges, indices);

                    const finalIndices = Array.from(indices).sort((a, b) => a - b);

                    if (finalIndices.length > 0) filterData(finalIndices);
                }

                // ***** Update state ***** //

                this.setState({
                    filterString: s1,
                });
            }
        } else {
            filterData([]);

            // ***** Update state ***** //

            this.setState({
                filterString: s1,
            });
        }
    };

    render() {
        const {filterString} = this.state;

        return (
            <div className="cp-filter cp-subsection-320">
                <input className="cp-filter-text-input-input"
                       type="text"
                       placeholder="e.g. 1, 3 - 4, 50% - 100%"
                       value={filterString}
                       onChange={this.handleInputChange} />
            </div>
        )
    }
}
