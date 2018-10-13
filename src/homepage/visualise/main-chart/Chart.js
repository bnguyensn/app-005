// @flow

import * as React from 'react';
import {select, event} from 'd3-selection';
import {scaleLinear, scaleBand} from 'd3-scale';
import {axis, axisBottom, axisLeft} from 'd3-axis';
import {stack, line} from 'd3-shape';
import {transition} from 'd3-transition';
import {formatLocale, format} from 'd3-format';

import ChartEmpty from './ChartEmpty';
import Pannable from './components/Pannable';
import Tooltip from './components/Tooltip';
import Controls from './components/Controls';
import Legend from './components/Legend';

import createScaleX from './chart-funcs/createScaleX';
import createScaleY from './chart-funcs/createScaleY';
import createAxisBottom from './chart-funcs/createAxisBottom';
import createAxisLeft from './chart-funcs/createAxisLeft';
import {getNewSeriesUE, coloriseSeriesUE}
    from './chart-funcs/createStackedSeries';
import createRects from './chart-funcs/createRects';
import {colorisePathUE, getPathUE} from './chart-funcs/createLimiterLines';
import generateTooltip from './chart-funcs/generateTooltip';

import type {ColorData, FundData} from '../../data/DataTypes';
import type {MiscCheckboxes} from '../control-panel/Misc';
import type {DraggableData} from './components/Pannable';
import type {MainChartSize} from '../chartSizes';

import './chart.css';

type ChartProps = {
    dataKey: boolean,
    data: ?FundData[],
    colorData: ?ColorData,
    miscCheckboxes: MiscCheckboxes,
    size: MainChartSize,
    curFund: number,  // Currently selected fund's id
    changeColorData: (name: string, newColor: string) => void,
    changeSize: (chart: string, newSize: {}) => void,
    onFundClick: (FundData) => void,
}

type ChartStates = {
    pannableX: number,
    tooltip: {
        show: boolean,
        text: string,
        pos: {top: number, left: number},
        color: string,
    },
}

export default class Chart
    extends React.PureComponent<ChartProps, ChartStates> {
    // React refs
    chartNodeRef: any;

    // D3.js - Scales & axes
    pannableWidth: number;
    scaleX: any;
    scaleY: any;

    // D3.js - Shapes
    seriesUE: any;
    pathUE: any;

    constructor(props: ChartProps) {
        super(props);

        this.DEBUGrendercount = 0;  // TODO: remove in production

        this.chartNodeRef = React.createRef();

        this.pannableWidth = 0;

        this.state = {
            pannableX: 0,
            tooltip: {
                show: false,
                text: '',
                pos: {top: 0, left: 0},
                color: '',
            },
        };
    }

    componentDidMount() {
        const {
            data, colorData, miscCheckboxes, size, curFund,
            onFundClick,
        } = this.props;

        if (data && colorData) {
            const chartNode = this.getChart();
            const pannableNode = this.getPannable();

            if (chartNode && pannableNode) {
                const chart = select(chartNode);
                const pannable = select(pannableNode);

                // ********** Update chart ********** //

                this.updateChart(chart, pannable, data, colorData,
                    miscCheckboxes, size, onFundClick);
            }
        }
    }

    componentDidUpdate(prevProps: ChartProps,
                       prevState: ChartStates, snapshot: any) {
        const {
            data: prevData, curFund: prevCurFund,
            colorData: prevColorData,
        } = prevProps;
        const {
            data, colorData, miscCheckboxes, size, curFund,
            onFundClick,
        } = this.props;
        const {pannableX: prevPannableX, tooltip: prevTooltip} = prevState;
        const {pannableX, tooltip} = this.state;

        if (data && colorData) {
            const curFundChanged = prevCurFund !== curFund;
            const tooltipChanged = prevTooltip.text !== tooltip.text;
            const chartMoved = prevPannableX !== pannableX;

            if (!tooltipChanged && !curFundChanged && !chartMoved) {
                const chartNode = this.getChart();
                const pannableNode = this.getPannable();

                if (chartNode && pannableNode) {
                    const chart = select(chartNode);
                    const pannable = select(pannableNode);

                    if (prevData === null
                        || (prevData
                            && this.compositionChanged(prevData, data))) {
                        // ********** Update chart ********** //

                        this.updateChart(chart, pannable, data, colorData,
                            miscCheckboxes, size, onFundClick);
                    } else if (prevColorData
                        && this.colorChanged(prevColorData, colorData)) {
                        // ********** Update colors ********** //

                        this.coloriseChartOnly(colorData);
                    }
                }
            }
        }
    }

    updateChart(chart: any, pannable: any, data: FundData[],
                colorData: ColorData, miscCheckboxes: MiscCheckboxes,
                size: MainChartSize,
                onFundClick: (FundData) => void) {
        // ********** Update scales ********** //

        this.scaleX = createScaleX(data, this.pannableWidth);
        this.scaleY = createScaleY(data, miscCheckboxes,
            size.height);

        // ********** Update axes ********** //

        createAxisBottom(data, chart.select('.x-axis'), this.scaleX);
        createAxisLeft(chart.select('.y-axis'), this.scaleY);

        // ********** Update shapes ********** //

        // ***** Stacked series ***** //

        this.seriesUE = getNewSeriesUE(data, colorData,
            miscCheckboxes, pannable);
        coloriseSeriesUE(this.seriesUE, colorData);

        // ***** Rects (vertical bars) ***** //

        createRects(this.seriesUE, size, this.scaleX,
            this.scaleY, this.showTooltip, this.hideTooltip,
            onFundClick);

        // ***** Limiter lines ***** //

        this.pathUE = getPathUE(data, this.scaleX, this.scaleY,
            pannable, size.height, this.showTooltip,
            this.hideTooltip, onFundClick);
        colorisePathUE(this.pathUE, colorData);
    }

    coloriseChartOnly = (colorData: ColorData) => {
        coloriseSeriesUE(this.seriesUE, colorData);
        colorisePathUE(this.pathUE, colorData);
    };

    /** ********** DATA CHANGES CHECKS ********** **/

    compositionChanged = (
        prevData: FundData[],
        curData: FundData[],
    ): boolean => {
        const prevIds = prevData.map(fundData => fundData.id);
        const curIds = curData.map(fundData => fundData.id);

        // Return true if the number of funds or the fund arrangements has
        // changed

        return prevIds.length !== curIds.length
            || prevIds.some((prevId, index) => prevId !== curIds[index])
    };

    colorChanged = (
        prevColorData: ColorData,
        curColorData: ColorData,
    ): boolean => {
        // Return true if the color data object has changed

        return JSON.stringify(prevColorData) !== JSON.stringify(curColorData)
    };

    /** ********** PANNABLE ********** **/

    pannableOnDrag = (e: Event, data: DraggableData) => {
        this.setState({
            pannableX: data.x,
        });
    };

    pannablePosReset = () => {
        this.setState({
            pannableX: 0,
        });
    };

    /** ********** TOOLTIPS ********** **/

    showTooltip = (d: any, i: number, nodes: any) => {
        const {colorData} = this.props;

        const tt = generateTooltip(d, i, nodes, colorData,
            this.scaleX);

        this.setState(prevState => ({
            ...prevState,
            tooltip: tt
                ? {
                    show: true,
                    text: tt.text,
                    pos: tt.pos,
                    color: tt.color,
                }
                : {
                    show: false,
                    text: '',
                    pos: {top: 0, left: 0},
                    color: '',
                },
        }));
    };

    hideTooltip = () => {
        const relTarget = event.relatedTarget;

        if (relTarget) {
            const relTargetClass = relTarget.getAttribute('class');

            // Only need to hide tooltip if not moving to another asset bar

            if (relTargetClass !== 'asset-bar'
                && relTargetClass !== 'limit-line') {
                this.setState(prevState => ({
                    ...prevState,
                    tooltip: {
                        show: false,
                        text: '',
                        pos: {top: 0, left: 0},
                        color: '',
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
        return document.getElementById('pannable');
    };

    /** ********** RENDER ********** **/

    render() {
        const {dataKey, data, colorData, size, changeColorData} = this.props;
        const {pannableX, tooltip} = this.state;

        console.log(`DEBUG_MainChartRenderCount=${this.DEBUGrendercount += 1}`);  // TODO: remove in production

        const svgWidth = size.width + size.margin.right + size.margin.left;
        const svgHeight = size.height + size.margin.top + size.margin.bottom;

        if (data) {
            this.pannableWidth = data.length <= 10 ? size.width : 54 * data.length;
        } else {
            this.pannableWidth = 0;
        }

        return (
            <div key={dataKey.toString()}
                 id="main-chart">
                {data
                    ? (
                        <svg width={svgWidth} height={svgHeight}>
                            <g ref={this.chartNodeRef}
                               className="chart"
                               transform={
                                   `translate(
                                   ${size.margin.left}, ${size.margin.top}
                                   )`}>
                                <Pannable width={this.pannableWidth}
                                          height={size.height}
                                          translateX={pannableX}
                                          pannableOnDrag={this.pannableOnDrag}>
                                    <rect width={this.pannableWidth}
                                          height={size.height}
                                          fillOpacity={0} />
                                    <g className="x-axis"
                                       transform={
                                           `translate(0, ${size.height})`} />
                                    <g className="vbars" />
                                    <g className="limit-lines" />
                                </Pannable>
                                <g className="y-axis">
                                    <rect className="bkg-rect-y-axis"
                                          width={size.margin.left}
                                          height={
                                              size.height + size.margin.bottom}
                                          transform={
                                              `translate(
                                              -${size.margin.left}, 0
                                              )`}
                                          fill="#F5F5F5" />
                                </g>
                            </g>

                        </svg>
                    )
                    : <ChartEmpty />}
                <Tooltip tooltip={tooltip} />
                <Legend data={data}
                        colorData={colorData}
                        changeColorData={changeColorData} />
                {data
                    ? <Controls pannablePosReset={this.pannablePosReset} />
                    : null}
            </div>
        )
    }
}
