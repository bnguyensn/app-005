// @flow

import * as React from 'react';
import {select} from 'd3-selection';
import {max} from 'd3-array';
import {scaleLinear, scaleBand} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import type {FundData} from './DataTypes';
import sumObjValues from '../lib/utils/sumObjValues';
import '../css/bar-chart.css';

type BarChartProps = {
    chartSize: {width: number, height: number},
    chartMargin: {top: number, right: number, bottom: number, left: number},
    barSize: number,
    data: FundData[],
};

export default class BarChart extends React.PureComponent<BarChartProps, {}> {
    node: any;

    constructor(props: BarChartProps) {
        super(props);
        this.node = React.createRef();
    }

    componentDidMount() {
        // this.updateChart();
    }

    componentDidUpdate() {
        // this.updateChart();
    }

    updateChart = () => {
        const {data, barSize, chartMargin, chartSize} = this.props;

        const svg = this.getSvg();
        if (svg) {
            // ********** Set up constants ********** //

            const fundNames = data.map(fundData => fundData.name);

            const fCalRems = data.map(fundData => Math.min(fundData.fCom - fundData.fCal, 0));
            const totalAssetL1s = data.map(fundData => (
                sumObjValues(Object.values(fundData.assetL1))
            ));
            const totalAssetL2s = data.map(fundData => (
                sumObjValues(Object.values(fundData.assetL1))
            ));
            const totalAssetL3s = data.map(fundData => (
                sumObjValues(Object.values(fundData.assetL1))
            ));

            const barMaxValue = max([fCalRems, totalAssetL1s, totalAssetL2s, totalAssetL3s]);

            // ********** Set up scale ********** //

            // Using band scale for x
            const x = scaleBand()
                .domain(fundNames)
                .range([0, chartSize.width])
                .padding(0.05);

            // Using linear scale for y
            // y scale's range runs from negative to 0 because svg's coordinate
            // system runs from top left to bottom right
            const y = scaleLinear()
                .domain([0, barMaxValue])
                .nice()
                .range([chartSize.height, 0]);

            // ********** Set up chart **********  //

            // TODO: continue here

            const chart = select(svg)
                .append('g')
                .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

            // Build axes

            /*const xAxis = axisBottom()
                .scale(xScale);

            const yAxis = axisLeft()
                .scale(yScale);

            chart.append('g')
                .attr('class', 'chart-x-axis')
                .attr('transform', `translate(0, ${chartSize.height})`)
                .call(xAxis);

            chart.append('g')
                .attr('class', 'chart-y-axis')
                .call(yAxis);*/

            // Build bars - verbose

            const uBar = chart
                .selectAll('.chart-bar')
                .data(data);

            const eBar = uBar.enter();

            const ueBar = eBar.append('g')
                .merge(uBar);

            ueBar.attr('transform', (d, i) => `translate(${i * barGroupSize}, 0)`);

            ueBar.append('rect')
                .attr('class', 'chart-bar')
                .style('fill', '#29B6F6')
                .attr('y', d => y(d))
                .attr('height', d => chartSize.height - y(d))
                .attr('width', barSize);

            ueBar.append('text')
                .attr('x', barSize / 2)
                .attr('y', d => y(d))
                .text(d => d);

            const exBar = uBar.exit();

            exBar.remove();
        }
    };

    getSvg = () => {
        if (this.node && this.node.current) {
            return this.node.current
        }
        return null
    };

    render() {
        const {chartSize, chartMargin} = this.props;

        return (
            <div className="chart-container">
                <svg ref={this.node}
                     width={chartSize.width + chartMargin.right + chartMargin.left}
                     height={chartSize.height + chartMargin.top + chartMargin.bottom} />
            </div>
        )
    }
}
