// @flow

import * as React from 'react';
import {select, event} from 'd3-selection';
import {scaleLinear, scaleBand} from 'd3-scale';
import {axis, axisBottom, axisLeft} from 'd3-axis';
import {stack, line} from 'd3-shape';
import {transition} from 'd3-transition';
import {formatLocale, format} from 'd3-format';

import ChartTooltip from './ChartTooltip';

import {findMaxInArray} from '../../lib/utils/arrayMaths';

import type {ColorData, FundData} from '../DataTypes';
import type {MiscCheckboxes} from '../control-panel/Misc';

import enUKLocaleDef from '../../json/d3-locales/en-UK';

import './chart.css';

const EN_UK = formatLocale(enUKLocaleDef);

type Line2Points = [[number, number], [number, number]];

type ChartProps = {
    chartSize: {
        width: number,
        height: number,
        marginTop: number,
        marginLeft: number,
        marginBottom: number,
        marginRight: number,
    },
    data: FundData[],
    colorData: ColorData,
    miscCheckboxes: MiscCheckboxes,
    mainChartElClickedFlag: boolean,
    handleChartElClicked: (fundData: FundData) => void,
    children?: React.Node,
};

type ChartStates = {
    tooltipChangeFlag: boolean,
    tooltip: {
        show: boolean,
        text: string,
        pos: {top: number, left: number},
        color: string,
    },
};

export default class Chart extends React.Component<ChartProps, ChartStates> {
    // React refs
    chartNodeRef: any;
    pannableNodeRef: any;

    // Complete fund Ids - Used to map x-axis label
    nameToDispNameMap: {[key: string]: string};

    // Data variables - These initialise using props but will mutate when sort
    // or filter functions are called
    pannableSize: {width: number, height: number};
    chartAssetData: {[key: string]: {lvl: number, color: string}};

    // Scales
    scaleX: any;
    scaleY: any;

    // Panning variables  // TODO: Move to HOC
    mouseXY: {x: number, y: number};
    mouseDown: boolean;
    chartOffset: {x: number, y: number};

    // Line generator
    lineGen: any;

    // Transition variables
    trans1: any;

    constructor(props: ChartProps) {
        super(props);

        this.chartNodeRef = React.createRef();
        this.pannableNodeRef = React.createRef();

        this.nameToDispNameMap = {};
        props.data.forEach((fundData) => {
            this.nameToDispNameMap[fundData.name] = fundData.dispName;
        });

        this.mouseXY = {x: 0, y: 0};
        this.mouseDown = false;
        this.chartOffset = {x: 0, y: 0};

        this.lineGen = line().defined(d => d !== null);

        this.trans1 = transition()
            .duration(2000);

        this.state = {
            tooltipChangeFlag: false,
            tooltip: {
                show: false,
                text: '',
                pos: {top: 0, left: 0},
                color: '',
            },
        };
    }

    componentDidMount() {
        this.handleNewDataset();
    }

    /**
     * We want d3js to handle re-rendering on data "mutation".
     *
     * The chart element still "reset" (unmount and remount) when a new dataset
     * is provided. This is done via changing the "key" prop up in <App />.
     * */
    componentDidUpdate(prevProps: ChartProps, prevState: ChartStates, snapshot: any) {
        const {mainChartElClickedFlag: prevMainChartElClickedFlag} = prevProps;
        const {mainChartElClickedFlag} = this.props;
        const {tooltipChangeFlag: prevTooltipChangeFlag} = prevState;
        const {tooltipChangeFlag} = this.state;

        const tooltipChanged = tooltipChangeFlag !== prevTooltipChangeFlag;
        const mainChartElClicked = mainChartElClickedFlag !== prevMainChartElClickedFlag;

        if (!tooltipChanged && !mainChartElClicked) {
            // Update chart

            const chartNode = this.getChart();
            const pannableNode = this.getPannable();
            if (chartNode && pannableNode) {
                const chart = select(chartNode);
                const pannable = select(pannableNode);

                this.updateChart(chart, pannable);
            }
        }
    }

    /**
     * This is called when a completely new dataset is used, which can be
     * triggered by the user uploading a new .xlsx and replacing
     * props.data.
     * */
    handleNewDataset = () => {
        const {data, chartSize, colorData} = this.props;



        // Warning: specific to data type
        // Create chart asset data which is an object of the form:
        // {assetName: {lvl: n, color: s}, ...}
        this.chartAssetData = {};
        data[0].assets.forEach((asset) => {
            this.chartAssetData[asset.name] = {lvl: 0, color: ''};
            this.chartAssetData[asset.name].lvl = asset.lvl;
            this.chartAssetData[asset.name]
                .color = colorData.assets[asset.name];
        });

        // Update chart

        const chartNode = this.getChart();
        const pannableNode = this.getPannable();
        if (chartNode && pannableNode) {
            const chart = select(chartNode);
            const pannable = select(pannableNode);

            // Clear previous content

            chart.selectAll('.clearable').remove();

            // Add one-time stuff

            // Background



            // Update chart

            this.updateChart(chart, pannable);
        }
    };

    updateChart = (chart: any, pannable: any) => {
        const {data, colorData, chartSize} = this.props;

        // ********** Update background ********** //

        this.pannableSize = {
            width: data.length <= 10
                ? chartSize.width
                : 54 * data.length,
            height: chartSize.height,
        };

        const bkgRect = pannable.insert('rect', ':first-child')
            .classed('bkg-rect clearable', true)
            .attr('width', this.pannableSize.width)
            .attr('height', chartSize.height)
            .attr('fill-opacity', 0);

        // ********** Update scale ********** //

        this.scaleX = this.createScaleX();  // Band scale
        this.scaleY = this.createScaleY();  // Linear scale

        // ********** Update axes ********** //

        // Axes

        const xAxis = this.createAxisBottom(chart.select('.x-axis'), this.scaleX);
        const yAxis = this.createAxisLeft(chart.select('.y-axis'), this.scaleY);

        // ********** Update shapes ********** //

        // Stacked series vertical bars

        const stackedSeries = this.createStackedSeries();

        const seriesU = pannable
            .select('.vbars')
            .selectAll('.vbar-series')
            .data(stackedSeries, d => d.key);

        seriesU.exit().remove();

        const seriesE = seriesU.enter();
        const seriesUE = seriesE.append('g')
            .classed('vbar-series clearable', true)
            .merge(seriesU);

        seriesUE.attr('fill', d => colorData.assets[d.key]);  // Colorise series

        // Individual rect

        const getRectHeight = (a, b) => this.scaleY(this.scaleY.domain()[1] - (b - a));
        const getRectY = (a, b) => this.scaleY(a) - getRectHeight(a, b);

        const rectU = seriesUE.selectAll('rect')
            .data(d => d, d => d.data.name);

        const rectX = rectU.exit();

        const transRectX = rectX.transition().duration(500);
        transRectX.attr('x', chartSize.width + chartSize.marginRight + chartSize.marginLeft).remove();

        rectX.on('mouseenter', null);
        rectX.on('mouseleave', null);
        rectX.on('click', null);

        const rectE = rectU.enter();

        const rectUE = rectE.append('rect')
            .classed('asset-bar', true)
            .merge(rectU);
        rectUE.attr('y', d => getRectY(d[0], d[1]));

        const transRectUE = rectUE.transition().duration(500);
        transRectUE.attr('width', this.scaleX.bandwidth())
            .attr('height', d => getRectHeight(d[0], d[1]))
            .attr('x', d => this.scaleX(d.data.name));

        rectUE.on('mouseenter', this.showTooltip);
        rectUE.on('mouseleave', this.hideTooltip);
        rectUE.on('click', this.handleChartElClicked);

        // ********** Update limiter line ********** //

        const lineData = this.createLineData(this.scaleX, this.scaleY);

        // Lines

        const pathU = pannable.selectAll('.limit-line')
            .data(lineData, d => d.name);

        const pathX = pathU.exit();

        const transPathX = pathX.transition().duration(500);
        transPathX.attr('transform', `translate(0, -${this.pannableSize.height})`)
            .attr('stroke-opacity', 0)
            .remove();

        pathX.on('mouseenter', null);
        pathX.on('mouseleave', null);
        pathX.on('click', null);

        const pathE = pathU.enter();

        const pathUE = pathE.append('path')
            .classed('limit-line', true)
            .merge(pathU);
        pathUE.attr('d', d => d.d)
            .attr('transform', `translate(0, ${this.pannableSize.height})`)
            .attr('stroke-opacity', 0)
            .attr('stroke', colorData.assets['Remaining investment commitments'])
            .attr('stroke-width', 5);

        const transPathUE = pathUE.transition().duration(500);
        transPathUE.attr('transform', 'translate(0, 0)')
            .attr('stroke-opacity', 1);

        pathUE.on('mouseenter', this.showTooltip);
        pathUE.on('mouseleave', this.hideTooltip);
        pathUE.on('click', this.handleChartElClicked);
    };

    /** ********** SCALES ********** **/

    createScaleX = () => {
        const {data} = this.props;

        const fundNames = data.map(fundData => fundData.name);

        // Using band scale for x
        return scaleBand()
            .domain(fundNames)
            .range([0, this.pannableSize.width])
            .padding(0.05);
    };

    createScaleY = () => {
        const {chartSize, data, miscCheckboxes} = this.props;

        const w = miscCheckboxes.weightedAssets;

        const dataMax = findMaxInArray(data.map(
            fundData => [
                fundData.remFCom,
                w ? fundData.totalAssetsW : fundData.totalAssets,
            ],
        ));

        // Using linear scale for y
        // y scale's range runs from negative to 0 because svg's coordinate
        // system runs from top left to bottom right
        return scaleLinear()
            .domain([0, dataMax])
            .nice()
            .range([chartSize.height, 0]);
    };

    /** ********** AXES ********** **/

    createAxisBottom = (parent: any, scale: any) => {
        // Note: band and point scales do not implement scale.ticks

        const axis = axisBottom(scale)
            .tickFormat(d => this.nameToDispNameMap[d]);

        return parent.call(axis);
    };

    createAxisLeft = (parent: any, scale: any) => {
        const axis = axisLeft(scale)
            .ticks(5)
            .tickFormat(EN_UK.format('$~s'));
        //.tickFormat(EN_UK.format('$,.0f'));

        return parent.call(axis)
    };

    /** ********** SHAPES ********** **/

    createStackedSeries = () => {
        const {data, miscCheckboxes} = this.props;

        const w = miscCheckboxes.weightedAssets;

        // Create stack data - Warning: specific to data type
        const stackData = data.map((fundData) => {
            const fundObj = {};
            fundObj.name = fundData.name;
            fundData.assets.forEach((asset) => {
                fundObj[asset.name] = w ? asset.amtW : asset.amt;
            });
            fundObj.fundData = fundData;
            return fundObj
        });

        // Create stack keys - Warning: specific to data type
        const anAssetsObj = data[0].assets;
        const compareFn = (a, b) => {
            if (a.lvl === b.lvl) {
                return a.name.localeCompare(b.name, 'en', {
                    sensitivity: 'base',
                    ignorePunctuation: true,
                    numeric: true,
                })
            }
            return a.lvl - b.lvl
        };
        anAssetsObj.sort(compareFn);
        const stackKeys = anAssetsObj.map(asset => asset.name);

        // Create stack generator
        const stackGen = stack()
            .keys(stackKeys);

        return stackGen(stackData)
    };

    createLineData = (xScale: any, yScale: any): {
        name: string,
        points: Line2Points,
        d: string,
    }[] => {
        const {data} = this.props;

        // Warning: specific to data type

        return data.map((fundData) => {
            const valueHeight = yScale(fundData.remFCom);
            const points = [
                [xScale(fundData.name), valueHeight],  // start [x, y]
                [xScale(fundData.name) + xScale.bandwidth(), valueHeight],  // end [x, y]
            ];

            return {
                name: 'Remaining investment commitments',
                amount: fundData.remFCom,
                points,
                fundData,
                d: this.lineGen(points),
            }
        });
    };

    /** ********** PANNING ********** **/

        // $FlowFixMe
    handlePannableClick = (e: SyntheticMouseEvent<SVGGElement>) => {
        // Nothing here for now...
    };

    // $FlowFixMe
    handlePannableMouseDown = (e: SyntheticMouseEvent<SVGGElement>) => {
        this.mouseDown = true;
    };

    // $FlowFixMe
    handlePannableMouseUp = (e: SyntheticMouseEvent<SVGGElement>) => {
        this.mouseDown = false;
    };

    // $FlowFixMe
    handlePannableMouseEnter = (e: SyntheticMouseEvent<SVGGElement>) => {
        const {clientX, clientY} = e;

        this.mouseXY.x = clientX;
        this.mouseXY.y = clientY;
    };

    // $FlowFixMe
    handlePannableMouseLeave = (e: SyntheticMouseEvent<SVGGElement>) => {
        this.mouseDown = false;
    };

    // $FlowFixMe
    handlePannableMouseMove = (e: SyntheticMouseEvent<SVGGElement>) => {
        const {clientX, clientY} = e;

        if (this.mouseDown) {
            const pannableNode = this.getPannable();
            if (pannableNode) {
                const pannable = select(pannableNode);
                this.chartOffset.x += clientX - this.mouseXY.x;
                pannable.attr('transform', `translate(${this.chartOffset.x}, 0)`);
            }
        }

        this.mouseXY.x = clientX;
        this.mouseXY.y = clientY;
    };

    /** ********** CLICKING ********** **/

    handleChartElClicked = (d: any, i: number, nodes: any) => {
        const {handleChartElClicked} = this.props;

        if (d.data && d.data.fundData) {
            handleChartElClicked(d.data.fundData);
        } else if (d.fundData) {
            handleChartElClicked(d.fundData);
        }
    };

    /** ********** TOOLTIP ********** **/

    showTooltip = (d: any, i: number, nodes: any) => {
        const {colorData} = this.props;

        const parentNode = nodes[i].parentElement;
        const elRect = nodes[i].getBoundingClientRect();

        if (parentNode && elRect) {
            const className = nodes[i].getAttribute('class');

            let name, amount, color;
            if (className === 'asset-bar') {
                name = parentNode.__data__.key;
                amount = d[1] - d[0];
                color = colorData.assets[name];
            } else {
                name = d.name;  // eslint-disable-line prefer-destructuring
                amount = d.amount;  // eslint-disable-line prefer-destructuring
                color = colorData.assets['Remaining investment commitments'];
            }

            const ttText = `${name}: ${EN_UK.format('$,.0f')(amount)}`;
            const ttPos = {
                top: elRect.top,
                left: elRect.left + this.scaleX.bandwidth() + 5,
            };

            this.setState(prevState => ({
                tooltipChangeFlag: !prevState.tooltipChangeFlag,
                tooltip: {
                    show: true,
                    text: ttText,
                    pos: ttPos,
                    color,
                },
            }));
        }
    };

    hideTooltip = () => {
        const relTarget = event.relatedTarget;

        if (relTarget) {
            const relTargetClass = relTarget.getAttribute('class');

            // Only need to hide tooltip if not moving to another asset bar

            if (relTargetClass !== 'asset-bar' || relTargetClass !== 'limit-line') {
                this.setState(prevState => ({
                    tooltipChangeFlag: !prevState.tooltipChangeFlag,
                    tooltip: {
                        ...prevState.tooltip,
                        show: false,
                    },
                }));
            }
        }
    };

    /** ********** UTILITIES ********** **/

    getChart = () => {
        if (this.chartNodeRef && this.chartNodeRef.current) {
            return this.chartNodeRef.current
        }
        return null
    };

    getPannable = () => {
        if (this.pannableNodeRef && this.pannableNodeRef.current) {
            return this.pannableNodeRef.current
        }
        return null
    };

    /** ********** RENDER ********** **/

    render() {
        const {chartSize, children} = this.props;
        const {tooltip} = this.state;

        return (
            <div className="chart-container">
                <svg width={chartSize.width + chartSize.marginRight + chartSize.marginLeft}
                     height={chartSize.height + chartSize.marginTop + chartSize.marginBottom}>
                    <g ref={this.chartNodeRef}
                       className="chart"
                       transform={`translate(${chartSize.marginLeft}, ${chartSize.marginTop})`}>
                        <g ref={this.pannableNodeRef}
                           className="pannable-x-only"
                           onClick={this.handlePannableClick}
                           onMouseDown={this.handlePannableMouseDown}
                           onMouseUp={this.handlePannableMouseUp}
                           onMouseEnter={this.handlePannableMouseEnter}
                           onMouseLeave={this.handlePannableMouseLeave}
                           onMouseMove={this.handlePannableMouseMove}>
                            <g className="x-axis"
                               transform={`translate(0, ${chartSize.height})`} />
                            <g className="vbars" />
                            <g className="limit-lines" />
                        </g>
                        <g className="y-axis">
                            <rect className="bkg-rect"
                                  width={chartSize.marginLeft}
                                  height={chartSize.height + chartSize.marginBottom}
                                  transform={`translate(-${chartSize.marginLeft}, 0)`}
                                  fill="#fff1e5" />
                        </g>
                    </g>
                </svg>
                <ChartTooltip show={tooltip.show}
                              text={tooltip.text}
                              pos={tooltip.pos}
                              color={tooltip.color} />
                {children}
            </div>
        )
    }
}
