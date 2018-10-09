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
import type {MiscCheckboxes} from '../control-panel/Misc';

import enUKLocaleDef from '../../json/d3-locales/en-UK';

const EN_UK = formatLocale(enUKLocaleDef);

export type AssetsChartSize = {
    margin: {top: number, right: number, bottom: number, left: number},
    width: number,
    height: number,
    radius: number,
    scaleFactor: number,
};

type AssetsChartTTTexts = {top: string, mid: string, bot: string};

type AssetsChartTTColors = {topC: string, midC: string, botC: string};

type AssetsChartProps = {
    size: AssetsChartSize,
    data: ?FundData,  // Important: data for 1 fund only
    colorData: ColorData,
    miscCheckboxes: MiscCheckboxes,
};

type AssetsChartStates = {
    curHovered: string,
    curHoveredAmt: number,
    curHoveredDepth: number,
    curHoveredLvl: number,
};

export default class AssetsChart extends React.PureComponent<AssetsChartProps, AssetsChartStates> {
    chartNodeRef: any;

    constructor(props: AssetsChartProps) {
        super(props);
        this.chartNodeRef = React.createRef();

        this.state = {
            curHovered: '',
            curHoveredAmt: 0,
            curHoveredDepth: 0,
            curHoveredLvl: 0,
        };
    }

    componentDidMount() {
        const {data} = this.props;
        const chartNode = this.getChartNode();
        if (chartNode && data) {
            const chart = select(chartNode);
            this.updateChart(chart);
        }
    }

    componentDidUpdate(prevProps: AssetsChartProps, prevStates: AssetsChartStates, snapshot: any) {
        const {data} = this.props;

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
        const {data, miscCheckboxes} = this.props;

        if (data) {
            const w = miscCheckboxes.weightedAssets;

            return hierarchy(createHierarchyData(data.assets, w))
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

    createTooltip = (): [AssetsChartTTTexts, AssetsChartTTColors] => {
        const {data, colorData, miscCheckboxes} = this.props;
        const {
            curHovered: name, curHoveredAmt: amount,
            curHoveredDepth: depth, curHoveredLvl: lvl,
        } = this.state;

        const w = miscCheckboxes.weightedAssets;

        if (data && name) {
            // An asset is being hovered over
            // Display this asset's information

            const p = ((amount / data.totalAssets) * 100).toFixed(0);

            return [
                {
                    top: restrictTooltipNumberString(
                        EN_UK.format('$,.0f')(amount),
                        amount,
                    ),
                    mid: restrictTooltipString(depth === 1
                        ? `${name} assets`
                        : name),
                    bot: `${p}% of fund's total assets`,
                },
                {
                    topC: '',
                    midC: depth === 1
                        ? colorData.assetLvls[lvl]
                        : colorData.assets[name],
                    botC: '',
                },
            ]
        }

        if (data) {
            // No assets are being hovered over
            // Display Total assets level

            const totalAssets = w ? data.totalAssetsW : data.totalAssets;

            return [
                {
                    top: restrictTooltipNumberString(
                        EN_UK.format('$,.0f')(totalAssets),
                        totalAssets,
                    ),
                    mid: 'Total assets',
                    bot: '',
                },
                {topC: '', midC: '', botC: ''},
            ]
        }

        return [
            {top: '', mid: '', bot: ''},
            {topC: '', midC: '', botC: ''},
        ]
    };


    showTooltip = (d: any, i: number, nodes: any) => {
        const {curHovered} = this.state;

        const name = d.data.name;  // eslint-disable-line prefer-destructuring

        if (!curHovered || name !== curHovered) {
            this.setState({
                curHovered: name,
                curHoveredAmt: d.value,  // eslint-disable-line prefer-destructuring
                curHoveredDepth: d.depth,
                curHoveredLvl: d.data.lvl,
            });
        }
    };

    hideTooltip = () => {
        const relTarget = event.relatedTarget;

        if (relTarget) {
            const relTargetClass = relTarget.getAttribute('class');

            // Only need to hide tooltip if not moving to another asset bar

            if (relTargetClass !== 'asset-arc') {
                this.setState({
                    curHovered: '',
                    curHoveredAmt: 0,
                    curHoveredDepth: 0,
                    curHoveredLvl: 0,
                });
            }
        }
    };

    /** ********** RENDER ********** **/

    render() {
        const {size, data} = this.props;

        const svgWidth = size.width + size.margin.right + size.margin.left;
        const svgHeight = size.height + size.margin.top + size.margin.bottom;

        const chartOffsetX = (size.width / 2) + size.margin.left;
        const chartOffsetY = (size.height / 2) + size.margin.top;

        const ttBoxSize = {
            ...size,
            width: size.width / 2,
            height: size.height / 2,
        };

        const [tooltipTexts, tooltipColors] = this.createTooltip();

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
