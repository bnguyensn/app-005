// @flow

import * as React from 'react';
import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import {select} from 'd3-selection';

type BarChartProps = {
    data: number[],
    barSize: number,
    chartSize: {width: number, height: number},
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
        const {data, barSize, chartSize} = this.props;

        if (this.node) {
            const chart = this.node.current;
            if (chart) {
                const dataMax = max(data);
                const yScale = scaleLinear()
                    .domain([0, dataMax])
                    .range([0, chartSize.height]);

                const bar = select(chart)
                    .selectAll('g')
                    .data(data);

                bar.exit().remove();

                bar.enter()
                    .append('g')
                    .attr('transform', (d, i) => `translate(${i * (barSize + 5)}, ${chartSize.height - yScale(d)}`);

                select(chart)
                    .selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect');

                select(chart)
                    .selectAll('rect')
                    .data(data)
                    .exit()
                    .remove();

                select(chart)
                    .selectAll('rect')
                    .data(data)
                    .style('fill', '#29B6F6')
                    .attr('x', (d, i) => i * (barSize + 5))
                    .attr('y', d => chartSize.height - yScale(d))
                    .attr('height', d => yScale(d))
                    .attr('width', barSize);
            }
        }
    };

    render() {
        const {chartSize} = this.props;

        return (
            <svg ref={this.node}
                 width={chartSize.width} height={chartSize.height} />
        )
    }
}
