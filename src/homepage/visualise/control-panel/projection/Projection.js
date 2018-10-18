// @flow

import * as React from 'react';

import regexInput from './regexInput';
import {addNYears} from './addOrRemoveYears';
import isNumber from '../../../lib/isNumber';

import type {CompanyData} from '../../../data/DataTypes';

import './projection.css';

type ProjectionProps = {
    data: ?CompanyData[],  // Using ORIGINAL data for now
    projectionYears: number,
    changeProjectionYears: (newProjectionYears: number) => void,
}

export default class Projection
    extends React.PureComponent<ProjectionProps, {}> {
    handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const {data, changeProjectionYears} = this.props;

        if (data) {
            const newVal = e.currentTarget.value;

            const regexedVal = regexInput(newVal);

            if (regexedVal === 'EMPTY') {
                changeProjectionYears(0, data);
            } else if (isNumber(regexedVal)) {
                const newData = addNYears(data, {}, regexedVal);

                changeProjectionYears(regexedVal, newData);
            }
        }
    };

    render() {
        const {projectionYears} = this.props;

        return (
            <div id="main-chart-control-panel-projection">
                <span>Years to project:</span>
                <input type="number"
                       min={0}
                       max={100}
                       step={1}
                       value={projectionYears}
                       onChange={this.handleChange} />

            </div>
        )
    }
}
