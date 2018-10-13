// @flow

import * as React from 'react';

import Filter from './filter/Filter';
import Sort from './sort/Sort';
// import Misc from './Misc';

import type {FundData} from '../../data/DataTypes';
import type {MiscCheckboxes} from './Misc';

import './control-panel.css';

type ControlPanelProps = {
    data: ?FundData[],
    filterStr: string,
    filterIndices: number[],
    sortKey: string,
    sortAsc: boolean,
    miscCheckboxes: MiscCheckboxes,
    changeFilterStr: (newFilterStr: string) => void,
    filterData: (indices: number[]) => void,
    sortData: (sortKey: string, asc: boolean) => void,
    changeMiscCheckboxes: (name: string) => void,
};

export default class ControlPanel
    extends React.PureComponent<ControlPanelProps, {}> {
    render() {
        const {
            data, filterStr, filterIndices, sortKey, sortAsc, miscCheckboxes,
            changeFilterStr, filterData, sortData, changeMiscCheckboxes,
        } = this.props;

        const fundsCount = data ? data.length : 0;

        return (
            <div id="main-chart-control-panel">
                <section>
                    <div className="title">
                        FILTER
                    </div>
                    <div className="description">
                        Filter data by typing in the input below. Use{' '}
                        commas &#8220; &#44; &#8221; to separate filters.
                    </div>
                    <Filter fundsCount={fundsCount}
                            filterStr={filterStr}
                            filterIndices={filterIndices}
                            changeFilterStr={changeFilterStr}
                            filterData={filterData}
                    />
                </section>
                <section>
                    <div className="title">
                        SORT
                    </div>
                    <div className="description">
                        Sort data by selecting an option below.
                    </div>

                </section>

                {/*<section className="cp-section">


                    <Sort sortData={sortData}
                          miscCheckboxes={miscCheckboxes} />
                    <Misc miscCheckboxes={miscCheckboxes}
                          changeCheckbox={changeMiscCheckboxes} />
                </section>*/}
            </div>
        )
    }
}
