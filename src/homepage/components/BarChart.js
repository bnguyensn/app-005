// @flow

import * as React from 'react';
import {axisBottom, axisLeft} from 'd3-axis';
import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import {select} from 'd3-selection';
import '../css/bar-chart.css';

type BarChartProps = {
    chartSize: {width: number, height: number},
    chartMargin: {top: number, right: number, bottom: number, left: number},
    barSize: number,
    data: number[],
};

export default class BarChart extends React.PureComponent<BarChartProps, {}> {
    node: any;

    constructor(props: BarChartProps) {
        super(props);
        this.node = React.createRef();
    }

    componentDidMount() {
        this.createChart();
    }

    componentDidUpdate() {
        this.createChart();
    }

    createChart = () => {
        const {data, barSize, chartMargin, chartSize} = this.props;

        if (this.node) {
            const svg = this.node.current;
            if (svg) {
                const dataMax = max(data);
                const xScale = scaleLinear()
                    .domain([0, data.length])
                    .range([0, chartSize.width]);
                const yScale = scaleLinear()
                    .domain([0, dataMax])
                    .range([chartSize.height, 0]);

                // Build the chart

                const chart = select(svg)
                    .append('g')
                    .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

                const xAxis = axisBottom()
                    .scale(xScale);

                const yAxis = axisLeft()
                    .scale(yScale);

                chart.append('g')
                    .attr('class', 'chart-x-axis')
                    .attr('transform', `translate(0, ${chartSize.height})`)
                    .call(xAxis);

                chart.append('g')
                    .attr('class', 'chart-y-axis')
                    .call(yAxis);

                // Populate data

                const bars = chart
                    .selectAll('.chart-bar')
                    .data(data);

                bars.exit().remove();

                const barGroupSize = barSize + 5;
                const bar = bars.enter()
                    .append('g')
                    .attr('transform', (d, i) => `translate(${i * barGroupSize}, 0)`);

                bar.append('rect')
                    .attr('class', 'chart-bar')
                    .style('fill', '#29B6F6')
                    .attr('y', d => yScale(d))
                    .attr('height', d => chartSize.height - yScale(d))
                    .attr('width', barSize);

                bar.append('text')
                    .attr('x', barSize / 2)
                    .attr('y', d => yScale(d))
                    .text(d => d);
            }
        }
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
