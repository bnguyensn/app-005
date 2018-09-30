// @flow

import * as React from 'react';
import {select} from 'd3-selection';
import {scaleLinear, scaleBand} from 'd3-scale';
import {axis, axisBottom, axisLeft} from 'd3-axis';
import {stack, line} from 'd3-shape';
import {transition} from 'd3-transition';

import type {FundData, AssetData, ColorData} from './DataTypes';

import {findMaxInArray} from '../lib/utils/arrayMaths';

import '../css/chart.css';

type ChartProps = {
    chartSize: {
        width: number,
        height: number,
        marginTop: number,
        marginLeft: number,
        marginBottom: number,
        marginRight: number,
    },
    defaultData: FundData[],
    defaultColorData: ColorData,
};

type ChartStates = {};

export default class Chart extends React.Component<ChartProps, ChartStates> {
    // React refs
    chartNodeRef: any;
    pannableNodeRef: any;

    // Data variables - These initialise using props but will mutate when sort
    // or filter functions are called
    mutatedData: FundData[];
    pannableSize: {width: number, height: number};
    chartAssetData: {[key: string]: {lvl: number, color: string}};

    // Panning variables
    mouseXY: {x: number, y: number};
    mouseDown: boolean;
    chartOffset: {x: number, y: number};

    // Filter variables
    dataRange: {start: number, end: number};

    constructor(props: ChartProps) {
        super(props);
        this.chartNodeRef = React.createRef();
        this.pannableNodeRef = React.createRef();

        this.mouseXY = {x: 0, y: 0};
        this.mouseDown = false;
        this.chartOffset = {x: 0, y: 0};
    }

    componentDidMount() {
        this.handleNewDataset();
    }

    /**
     * The chart element never re-renders on prop changes. This is because we
     * want d3js to handle re-rendering on data "mutation".
     *
     * The chart element still "reset" (unmount and remount) when a new dataset
     * is provided. This is done via changing the "key" prop and does not take
     * into account shouldComponentUpdate()'s return value.
     * */
    shouldComponentUpdate(nextProps: ChartProps, nextState: ChartStates, nextContext: any): boolean {
        const {defaultData} = nextProps;

        this.mutatedData = [...defaultData];

        // Update chart

        const chartNode = this.getChart();
        const pannableNode = this.getPannable();
        if (chartNode && pannableNode) {
            const chart = select(chartNode);
            const pannable = select(pannableNode);

            this.updateChart(chart, pannable);
        }

        return false
    }

    componentDidUpdate() {
        this.handleNewDataset();
    }

    /**
     * This is called when a completely new dataset is used, which can be
     * triggered * by the user uploading a new .xlsx and replacing
     * props.defaultData.
     * */
    handleNewDataset = () => {
        const {defaultData, chartSize, defaultColorData} = this.props;

        this.mutatedData = [...defaultData];
        this.pannableSize = Object.assign({}, chartSize);

        // Warning: specific to data type
        this.chartAssetData = {};
        defaultData[0].assets.forEach((asset) => {
            this.chartAssetData[asset.name] = {lvl: 0, color: ''};
            this.chartAssetData[asset.name].lvl = asset.lvl;
            this.chartAssetData[asset.name].color = defaultColorData[asset.lvl.toString()];
        });

        const chartNode = this.getChart();
        const pannableNode = this.getPannable();
        if (chartNode && pannableNode) {
            const chart = select(chartNode);
            const pannable = select(pannableNode);

            // Clear previous content

            chart.selectAll('.clearable').remove();

            // Update chart

            this.updateChart(chart, pannable);
        }
    };

    updateChart = (chart: any, pannable: any) => {
        const {chartSize} = this.props;

        // ********** Update scale ********** //

        const x = this.createScaleX();  // Band scale
        const y = this.createScaleY();  // Linear scale

        // ********** Update axes ********** //

        const xAxis = this.createAxisBottom(pannable, x);
        const yAxis = this.createAxisLeft(chart, y);

        // ********** Update shapes ********** //

        // Set up generic transitions

        const trans1 = transition()
            .duration(750);

        // Stacked series vertical bars

        const stackedSeries = this.createStackedSeries();

        const seriesU = pannable.selectAll('.vbar-series')
            .data(stackedSeries);
        const seriesE = seriesU.enter();
        const seriesUE = seriesE.append('g')
            .classed('vbar-series clearable', true)
            .merge(seriesU);

        seriesUE.attr('fill', d => this.chartAssetData[d.key].color);  // Colorise series

        seriesU.exit().remove();

        // Individual rect

        const rectU = seriesUE.selectAll('rect')
            .data(d => d);
        const rectE = rectU.enter();
        const rectUE = rectE.append('rect')
            .merge(rectU);

        const getRectHeight = (a, b) => y(y.domain()[1] - (b - a));
        const getRectY = (a, b) => y(a) - getRectHeight(a, b);

        rectUE.attr('width', x.bandwidth())
            .attr('x', d => x(d.data.name))
            .attr('y', d => getRectY(d[0], d[1]));

        const rectUETrans = rectUE.transition(trans1)
            .attr('height', d => getRectHeight(d[0], d[1]));

        rectUE.exit().remove();

        // ********** Update limiter line ********** //

        const lineData = this.createLineData(x, y);
        const lineGen = line().defined(d => d !== null);

        // Lines

        pannable.append('g')
            .classed('limit-line clearable', true);

        const lineU = pannable.selectAll('.limit-line')
            .append('path')
            .attr('d', lineGen(lineData))
            .attr('stroke', '#63201E')
            .attr('stroke-width', 0);

        const lineUTrans = lineU.transition(trans1)
            .attr('stroke-width', 5);

        // ********** Update background rect ********** //

        const bkgRect = pannable.insert('rect', ':first-child')
            .classed('bkg-rect clearable', true)
            .attr('width', this.pannableSize.width)
            .attr('height', chartSize.height)
            .attr('fill-opacity', 0);
    };

    /** ********** SCALES ********** **/

    createScaleX = () => {
        const fundNames = this.mutatedData.map(fundData => fundData.name);

        // Using band scale for x
        return scaleBand()
            .domain(fundNames)
            .range([0, this.pannableSize.width])
            .padding(0.05);
    };

    createScaleY = () => {
        const {chartSize} = this.props;

        // Warning: specific to data type
        const fCalRems = this.mutatedData.map(fundData => Math.min(fundData.fCom - fundData.fCal, 0));
        const totalAssetsReducer = (acc, curVal): number => acc + curVal.amt;
        const totalAssets = this.mutatedData.map(fundData => fundData.assets.reduce(totalAssetsReducer, 0));

        const dataMax = findMaxInArray([fCalRems, totalAssets]);

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

        const {chartSize} = this.props;

        const axis = axisBottom(scale);

        return parent.append('g')
            .classed('x-axis clearable', true)
            .attr('transform', `translate(0, ${chartSize.height})`)
            .call(axis);
    };

    createAxisLeft = (parent: any, scale: any) => {
        const axis = axisLeft(scale)
            .ticks(5, ',f');

        return parent.append('g')
            .classed('y-axis clearable', true)
            .call(axis);
    };

    /** ********** SHAPES ********** **/

    createStackedSeries = () => {
        // Create stack data - Warning: specific to data type
        const stackData = this.mutatedData.map((fundData) => {
            const fundObj = {};
            fundObj.name = fundData.name;
            fundData.assets.forEach((asset) => {
                fundObj[asset.name] = asset.amt;
            });
            return fundObj
        });

        // Create stack keys - Warning: specific to data type
        const anAssetsObj = this.mutatedData[0].assets;
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

    createLineData = (xScale: any, yScale: any) => {
        // Warning: specific to data type
        const lineData = [];
        this.mutatedData.forEach((fundData, index) => {
            const fRem = fundData.fCom - fundData.fCal;
            const valueHeight = yScale(fRem);
            lineData.push([xScale(fundData.name), valueHeight]);  // start [x, y]
            lineData.push([xScale(fundData.name) + xScale.bandwidth(), valueHeight]);  // end [x, y]
            if (index < this.mutatedData.length - 1) {
                lineData.push(null);  // gap
            }
        });

        return lineData
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

    /** ********** FILTER ********** **/

    filterData = () => {
        // Mutate data

        // TODO:


    };

    /** ********** SORT ********** **/

    // TODO

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
        const {chartSize} = this.props;

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
                           onMouseMove={this.handlePannableMouseMove} />
                    </g>
                </svg>
            </div>
        )
    }
}
