// @flow

import * as React from 'react';

import type {FundData} from './DataTypes';

function LongBar(props) {
    return (
        <div className="filterslider-long-bar">

        </div>
    )
}

type StopBarProps = {
    order: number,
    updateDataRange: (newDataRange: {start: number, end: number}) => void,
};

function StopBar(props: StopBarProps) {
    return (
        <div className="filterslider-stop-bar-container">
            <div className="filterslider-stop-bar" />
            <span className="filterslider-text"></span>
        </div>
    )
}

type FilterSliderProps = {
    defaultData: FundData[],
    updateData: (data: FundData[]) => void,
};

export default class FilterSlider extends React.PureComponent<FilterSliderProps, {}> {


    render() {
        const {updateDataRange} = this.props;

        return (
            <div className="filterslider-container">
                <LongBar />
                <StopBar order={0} updateDataRange={updateDataRange} />
                <StopBar order={1} updateDataRange={updateDataRange} />
            </div>
        )
    }
}
