// @flow

import * as React from 'react';
import {arc} from 'd3-shape';

import AssetsChart from './AssetsChart';
import GCChartEmpty from './GCChartEmpty';

import type {ColorData, FundData} from '../DataTypes';
import type {AssetsChartSize} from './AssetsChart';
import GCChart from './GCChart';
import GCChartTooltip from './GCChartTooltip';

type AnalyticsProps = {
    size: AssetsChartSize,
    data: ?FundData,  // Important: data for 1 fund only
    colorData: ColorData,
};

export default class Analytics extends React.PureComponent<AnalyticsProps, {}> {
    render() {
        const {size, data, colorData} = this.props;

        let conclusion = '&nbsp;';
        let tempTTText = '&nbsp;';
        if (data) {
            if (data.goingConcern >= 2) {
                conclusion = 'is very good!';
            } else if (data.goingConcern >= 1 && data.goingConcern < 2) {
                conclusion = 'is good.';
            } else if (data.goingConcern >= 0.5 && data.goingConcern < 1) {
                conclusion = 'could be better.'
            } else {
                conclusion = 'is quite the pickle!'
            }

            tempTTText = `${data.name}'s going concern ratio is ${data.goingConcern.toFixed(2)} `
                + `(ranked #${data.sortIndices.goingConcern + 1}). This ${conclusion}`;
        }

        return (
            <div id="analytics">
                <div className="title">FUND ANALYTICS</div>

                <div className="fund-title">{data ? data.name : '---'}</div>

                <div className="subtitle">Going Concern Analytics</div>
                {data
                    ? (
                        <GCChartTooltip size={{width: 320, height: 150}}
                                        text={tempTTText}
                                        color="" />
                    )
                    : <GCChartEmpty />}

                <div className="subtitle">Assets Analytics</div>
                <AssetsChart size={size} data={data} colorData={colorData} />
            </div>
        )
    }
}
