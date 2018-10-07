// @flow

import * as React from 'react';
import {arc} from 'd3-shape';

import AssetsChart from './AssetsChart'

import type {ColorData, FundData} from '../DataTypes';
import type {AssetsChartSize} from './AssetsChart';

type AnalyticsProps = {
    size: AssetsChartSize,
    data: ?FundData,  // Important: data for 1 fund only
    colorData: ColorData,
};

export default class Analytics extends React.PureComponent<AnalyticsProps, {}> {
    render() {
        const {size, data, colorData} = this.props;

        return (
            <div id="analytics">
                <AssetsChart size={size} data={data} colorData={colorData} />
            </div>
        )
    }
}
