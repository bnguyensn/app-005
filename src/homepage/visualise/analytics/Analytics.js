// @flow

import * as React from 'react';
import {arc} from 'd3-shape';

import AssetsChart from './AssetsChart';
import GCChartEmpty from './GCChartEmpty';
import GCChart from './GCChart';
import GCChartTooltip from './GCChartTooltip';

import type {ColorData, FundData} from '../../data/DataTypes';
import type {AssetsChartSize} from './AssetsChart';
import type {MiscCheckboxes} from '../control-panel/Misc';

import './analytics.css';

type AnalyticsProps = {
    size: AssetsChartSize,
    data: ?FundData,  // Important: data for 1 fund only
    colorData: ColorData,
    miscCheckboxes: MiscCheckboxes,
};

export default class Analytics extends React.PureComponent<AnalyticsProps, {}> {
    render() {
        const {size, data, colorData, miscCheckboxes} = this.props;

        const w = miscCheckboxes.weightedAssets;

        let conclusion = '&nbsp;';
        let tempTTText = '&nbsp;';
        if (data) {
            const goingConcern = w ? data.goingConcernW : data.goingConcern;
            const goingConcernSI = w
                ? data.sortIndices.goingConcernW.des
                : data.sortIndices.goingConcern.des;

            if (goingConcern >= 2) {
                conclusion = 'is very good!';
            } else if (goingConcern >= 1 && goingConcern < 2) {
                conclusion = 'is good.';
            } else if (goingConcern >= 0.5 && goingConcern < 1) {
                conclusion = 'could be better.'
            } else {
                conclusion = 'is quite the pickle!'
            }

            tempTTText = `${data.name}'s going concern ratio is ${goingConcern.toFixed(2)} `
                + `(ranked #${goingConcernSI + 1}). This ${conclusion}`;
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
                <AssetsChart size={size}
                             data={data}
                             colorData={colorData}
                             miscCheckboxes={miscCheckboxes} />
            </div>
        )
    }
}
