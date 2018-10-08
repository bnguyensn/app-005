// @flow

import * as React from 'react';
import {event, select} from 'd3-selection';
import {arc} from 'd3-shape';
import {transition} from 'd3-transition';

import GCChartTooltip from './GCChartTooltip';
import GCChartEmpty from './GCChartEmpty';

import type {FundData} from '../DataTypes';

const CHART_MARGINS = {
    top: 10, right: 10, bottom: 10, left: 10,
};

const CHART_SIZE = {
    width: 320 - CHART_MARGINS.left - CHART_MARGINS.right,
    height: 320 - CHART_MARGINS.top - CHART_MARGINS.bottom,
};

type GCChartProps = {
    data: FundData,  // Note that this is fund data for 1 fund only
};

type GCChartStates = {
    text: string,
    textColor: string,
};

export default class GCChart extends React.PureComponent<GCChartProps, GCChartStates> {
    chartNodeRef: any;

    constructor(props: GCChartProps) {
        super(props);
        this.chartNodeRef = React.createRef();

        this.state = {
            text: '',
            textColor: '',
        };
    }

    getChartNode = () => {
        if (this.chartNodeRef && this.chartNodeRef.current) {
            return this.chartNodeRef.current
        }
        return null
    };

    render() {
        const {data} = this.props;
        const {text, textColor} = this.state;

        const svgWidth = CHART_SIZE.width + CHART_SIZE.margin.right + CHART_SIZE.margin.left;
        const svgHeight = CHART_SIZE.height + CHART_SIZE.margin.top + CHART_SIZE.margin.bottom;

        const chartOffsetX = (CHART_SIZE.width / 2) + CHART_SIZE.margin.left;
        const chartOffsetY = (CHART_SIZE.height / 2) + CHART_SIZE.margin.top;

        return (
            <div className="gc-chart-container">
                {data
                    ? <GCChartTooltip size={{width: 320, height: 320}}
                                      text={text}
                                      color={textColor} />
                    : null}
                {data
                    ? (
                        <svg className="gc-chart-svg"
                             width={svgWidth}
                             height={svgHeight}>
                            <g ref={this.chartNodeRef}
                               className="gc-chart"
                               transform={
                                   `translate(${chartOffsetX}, ${chartOffsetY})`
                               }>
                                <g className="arcs" />
                            </g>
                        </svg>
                    )
                    : <GCChartEmpty size={{width: 320, height: 320}} />}
            </div>
        )
    }
}
