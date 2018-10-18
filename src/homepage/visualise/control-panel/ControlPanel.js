// @flow

import * as React from 'react';


//import Filter from './filter/Filter';
//import Sort from './sort/Sort';
//import Misc from './Misc';

import type {CompanyData} from '../../data/DataTypes';
import type {MiscCheckboxes} from './Misc';

import './control-panel.css';
import SwitchCompany from './switch-company/SwitchCompany';
import Projection from './projection/Projection';

type ControlPanelProps = {
    data: ?CompanyData[],

    companyNames: string[],
    curCompany: string,
    switchCompany: (newCurCompany: string) => void,

    projectionYears: number,
    changeProjectionYears: (newProjectionYears: number) => void,

    filterStr: string,
    filterIndices: number[],
    changeFilterStr: (newFilterStr: string) => void,
    filterData: (indices: number[]) => void,

    sortKey: string,
    sortAsc: boolean,
    sortData: (sortKey: string, asc: boolean) => void,

    miscCheckboxes: MiscCheckboxes,
    changeMiscCheckboxes: (name: string) => void,
};

export default class ControlPanel
    extends React.PureComponent<ControlPanelProps, {}> {
    render() {
        const {
            data,
            companyNames, curCompany, switchCompany,
            projectionYears, changeProjectionYears,
            filterStr, filterIndices, changeFilterStr, filterData,
            sortKey, sortAsc, sortData,
            miscCheckboxes, changeMiscCheckboxes,
        } = this.props;

        const fundsCount = data ? data.length : 0;

        return (
            <div id="main-chart-control-panel">
                <section>
                    <div className="title">
                        CHANGE COMPANY
                    </div>
                    <div className="description">
                        Change company by selecting an option below.
                    </div>
                    <SwitchCompany companyNames={companyNames}
                                   curCompany={curCompany}
                                   switchCompany={switchCompany} />
                </section>
                <section>
                    <div className="title">
                        PROJECTION
                    </div>
                    <div className="description">
                        Project future years (max 100) by using the options below.
                    </div>
                    <Projection data={data[curCompany]}
                                projectionYears={projectionYears}
                                changeProjectionYears={changeProjectionYears} />
                </section>
                {/*<section>
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
                </section>*/}
                {/*<section>
                    <div className="title">
                        SORT
                    </div>
                    <div className="description">
                        Sort data by selecting an option below.
                    </div>

                </section>*/}
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
