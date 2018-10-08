// @flow

import * as React from 'react';
import {event, select} from 'd3-selection';
import {scaleLinear, scaleSqrt} from 'd3-scale';
import {hierarchy, partition} from 'd3-hierarchy';
import {arc} from 'd3-shape';
import {transition} from 'd3-transition';
import {formatLocale, format} from 'd3-format';

import AssetsChartEmpty from './AssetsChartEmpty';
import AssetsChartTooltip from './AssetsChartTooltip';
import createHierarchyData from './createHierarchyData';
import {restrictTooltipNumberString, restrictTooltipString} from './restrictTooltipString';

import type {ColorData, FundData} from '../DataTypes';

import enUKLocaleDef from '../../json/d3-locales/en-UK';

import './analytics.css';

const EN_UK = formatLocale(enUKLocaleDef);

export type AssetsChartSize = {
    margin: {top: number, right: number, bottom: number, left: number},
    width: number,
    height: number,
    radius: number,
    scaleFactor: number,
};

type AssetsChartProps = {
    size: AssetsChartSize,
    data: ?FundData,  // Important: data for 1 fund only
    colorData: ColorData,
};

type AssetsChartStates = {
    curHovered: string,
    tooltipTexts: {top: string, mid: string, bot: string},
    tooltipColors: {topC: string, midC: string, botC: string},
};

export default class AssetsChart extends React.PureComponent<AssetsChartProps, AssetsChartStates> {
    chartNodeRef: any;

    constructor(props: AssetsChartProps) {
        super(props);
        this.chartNodeRef = React.createRef();

        this.state = {
            curHovered: '',
            tooltipTexts: {
                top: props.data
                    ? restrictTooltipNumberString(
                        EN_UK.format('$,.0f')(props.data.totalAssets),
                    )
                    : '',
                mid: 'Total assets',
                bot: '',
            },
            tooltipColors: {
                topC: '',
                midC: '',
                botC: '',
            },
        };
    }

    componentDidMount() {
        console.log('assets chart did mount');

        const {data} = this.props;
        const chartNode = this.getChartNode();
        if (chartNode && data) {
            const chart = select(chartNode);
            this.updateChart(chart);
        }
    }

    componentDidUpdate(prevProps: AssetsChartProps, prevStates: AssetsChartStates, snapshot: any) {
        console.log('assets chart did update');

        const {data} = this.props;
        const {data: prevData} = prevProps;

        if (!prevData && !data) {
            return
        }

        if (data && prevData && prevData.id !== data.id) {
            this.setState({
                ...prevStates,
                tooltipTexts: {
                    top: data
                        ? restrictTooltipNumberString(
                            EN_UK.format('$,.0f')(data.totalAssets),
                        )
                        : '',
                    mid: 'Total assets',
                    bot: '',
                },
            });
        }

        if (data) {
            const chartNode = this.getChartNode();
            if (chartNode) {
                const chart = select(chartNode);
                this.updateChart(chart);
            }
        }
    }

    updateChart = (chart: any) => {
        const {colorData} = this.props;

        // ********** Set up hierarchy and root node ********** //

        const p = this.createPartition();

        const rootNode = this.createRootNode();

        if (rootNode) {
            // node.sum or node.count must be called before invoking a hierarchical
            // layout that requires node.value
            rootNode.sum(d => d.size);

            p(rootNode);

            // ********** Update chart ********** //

            // ***** Arcs ***** //

            const arcGenerator = this.createArc();

            // Update

            const arcU = chart.selectAll('.arc')
                .data(rootNode.descendants());

            // Exit

            const arcX = arcU.exit();
            arcX.remove();

            arcX.on('mouseenter', null);
            arcX.on('mouseleave', null);

            // Enter

            const arcE = arcU.enter();

            // Update + Enter

            const arcUE = arcE.append('path')
                .classed('asset-arc', true)
                .merge(arcU);
            arcUE.attr('display', d => d.depth ? null : 'none')
                .attr('d', arcGenerator)
                .attr('stroke-width', 0)
                .attr('fill',
                    d => d.depth === 2
                        ? colorData.assets[d.data.name]
                        : colorData.assetLvls[d.data.lvl]);

            arcUE.on('mouseenter', this.showTooltip);
            arcUE.on('mouseleave', this.hideTooltip);
        }
    };

    createPartition = () => {
        const {size} = this.props;

        return partition().size([2 * Math.PI, size.radius ** size.scaleFactor]);
    };

    createRootNode = () => {
        const {data} = this.props;

        if (data) {
            return hierarchy(createHierarchyData(data.assets))
        }
        return null
    };

    createArc = () => {
        const {size} = this.props;

        return arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => d.y0 ** (1 / size.scaleFactor))
            .outerRadius(d => d.y1 ** (1 / size.scaleFactor))
    };

    getChartNode = () => {
        if (this.chartNodeRef && this.chartNodeRef.current) {
            return this.chartNodeRef.current
        }
        return null
    };

    /** ********** TOOLTIP ********** **/

    showTooltip = (d: any, i: number, nodes: any) => {
        const {data, colorData} = this.props;
        const {curHovered} = this.state;

        if (data) {
            const name = d.data.name;  // eslint-disable-line prefer-destructuring

            if (!curHovered || name !== curHovered) {
                const amount = d.value;  // eslint-disable-line prefer-destructuring
                const p = ((amount / data.totalAssets) * 100).toFixed(0);

                const top = restrictTooltipNumberString(
                    EN_UK.format('$,.0f')(amount),
                );

                const mid = restrictTooltipString(d.depth === 1
                    ? `${name} assets`
                    : name);

                const bot = `${p}% of fund's total assets`;

                this.setState({
                    curHovered: name,
                    tooltipTexts: {top, mid, bot},
                    tooltipColors: {
                        topC: '',
                        midC: d.depth === 1
                            ? colorData.assetLvls[d.data.lvl]
                            : colorData.assets[name],
                        botC: '',
                    },
                });
            }
        }
    };

    hideTooltip = () => {
        const {data} = this.props;

        if (data) {
            const relTarget = event.relatedTarget;

            if (relTarget) {
                const relTargetClass = relTarget.getAttribute('class');

                // Only need to hide tooltip if not moving to another asset bar

                if (relTargetClass !== 'asset-arc') {
                    this.setState({
                        curHovered: '',
                        tooltipTexts: {
                            top: restrictTooltipNumberString(
                                EN_UK.format('$,.0f')(data.totalAssets),
                            ),
                            mid: 'Total assets',
                            bot: '',
                        },
                        tooltipColors: {
                            name: '',
                            amount: '',
                            bottomText: '',
                        },
                    });
                }
            }
        }
    };

    /** ********** RENDER ********** **/

    render() {
        console.log('assets chart render');

        const {size, data} = this.props;
        const {tooltipTexts, tooltipColors} = this.state;

        const svgWidth = size.width + size.margin.right + size.margin.left;
        const svgHeight = size.height + size.margin.top + size.margin.bottom;

        const chartOffsetX = (size.width / 2) + size.margin.left;
        const chartOffsetY = (size.height / 2) + size.margin.top;

        const ttBoxSize = {
            ...size,
            width: size.width / 2,
            height: size.height / 2,
        };

        return (
            <div className="assets-chart-container">
                {data
                    ? (
                        <AssetsChartTooltip size={ttBoxSize}
                                            texts={tooltipTexts}
                                            textColors={tooltipColors} />
                    )
                    : null}
                {data
                    ? (
                        <svg className="assets-chart-svg"
                             width={svgWidth}
                             height={svgHeight}>
                            <g ref={this.chartNodeRef}
                               className="assets-chart"
                               transform={
                                   `translate(${chartOffsetX}, ${chartOffsetY})`
                               }>
                                <g className="arcs" />
                            </g>
                        </svg>
                    )
                    : <AssetsChartEmpty size={size} />}
            </div>
        )
    }
}
