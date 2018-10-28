// @flow

import * as React from 'react';
import {select, event} from 'd3-selection';

import ChartEmpty from './ChartEmpty';

import {selectionHasClass} from './chart-funcs/helpers';
import {drawChordDiagram} from './chart-funcs/drawChordDiagram';

import type {ActiveItem, DataConfig, NameData, Updates} from '../data/Types';
import type {ArcChartSize} from '../chartSizes';
import type {ChordData} from './chart-funcs/createChordData';

import './chart.css';

type RedrawChartConfig = {
    clearAll: boolean,
};

type ChartProps = {
    dataKey: boolean,

    chordData: ChordData,

    nameData: NameData,
    colorScale: any,
    dataConfig: DataConfig,

    size: ArcChartSize,

    updates: Updates,

    allowEvents: boolean,

    handleHover: (item: ActiveItem) => void,
    handleUnhover: () => void,
};

export default class Chart
    extends React.PureComponent<ChartProps, {}> {
    // React refs
    chartNodeRef: any;

    // D3.js - Shapes - To isolate color changing activities
    chordRings: any;
    chordRibbons: any;

    // D3.js - Transition - To manage repeating transitions
    repeatingTransitions: any[];

    // DEBUG  // TODO: remove in production
    DEBUGRenderCount: number;

    constructor(props: ChartProps) {
        super(props);

        this.repeatingTransitions = [];

        this.DEBUGRenderCount = 0;  // TODO: remove in production

        this.chartNodeRef = React.createRef();
    }

    componentDidMount() {
        const {chordData, nameData, colorScale} = this.props;

        if (chordData && nameData && colorScale) {
            const chartNode = this.getChart();

            if (chartNode) {
                const chart = select(chartNode);

                // ********** Redraw chart ********** //

                this.redrawChart(chart, {clearAll: true});
            }
        }
    }

    componentDidUpdate(prevProps: ChartProps, prevState: {}, snapshot: any) {
        const {
            dataKey: prevDataKey,
            chordData: prevData,
            dataConfig: prevDataConfig,
            size: prevSize,
        } = prevProps;
        const {
            dataKey,
            chordData,
            nameData, colorScale, dataConfig,
            size,
        } = this.props;

        if (chordData && nameData && colorScale) {
            const chartNode = this.getChart();

            if (chartNode) {
                const chart = select(chartNode);

                if (prevData === null
                    || (prevDataKey !== dataKey)) {
                    // ********** Redraw chart ********** //

                    this.redrawChart(chart, {clearAll: true});
                } else if (prevSize.width !== size.width
                    || prevSize.height !== size.height
                ) {
                    // ********** Redraw chart ********** //

                    this.redrawChart(chart, {clearAll: true});
                } else if (prevDataConfig.curSheet !== dataConfig.curSheet) {
                    // ********** Redraw chart (no clear all) ********** //

                    this.redrawChart(chart, {clearAll: false});
                } else {
                    // ********** Update chart ********** //

                    this.applyUpdates(chart);
                }
            }
        }
    }

    /** ********** CHART DRAWINGS / UPDATES ********** **/

    redrawChart = (chart: any, config: RedrawChartConfig) => {
        const {
            chordData,
            nameData, colorScale,
            size,
        } = this.props;

        // ***** Remove clearables ***** //

        if (config.clearAll) {
            chart.selectAll('*')
                .remove();
        }

        // ***** Draw chord diagram ***** //

        const chordDiagramEA = [
            {event: 'mouseenter', action: this.handleMouseEnter},
            {event: 'mouseleave', action: this.handleMouseLeave},
        ];

        const {chordRings, chordRibbons} = drawChordDiagram(
            chart, chordData, nameData, colorScale, size,
            config.clearAll, chordDiagramEA,
        );

        this.chordRings = chordRings;
        this.chordRibbons = chordRibbons;

        //this.applyStage(chart);
        this.applyUpdates(chart);
    };

    applyUpdates = (chart: any) => {
        const {updates} = this.props;
        const {selectFns, selectors, updateFns, updateFnParams} = updates;

        const updateSels = selectors.map((selector, i) => (
            selectFns[i](chart, selector)
        ));

        updateSels.forEach((s, i) => {
            updateFns[i](s, ...updateFnParams[i]);
        });
    };

    /** ********** EVENTS ********** **/

    handleMouseEnter = (d: any, i: number, nodes: any) => {
        const {allowEvents, handleHover} = this.props;

        if (allowEvents) {
            event.stopPropagation();

            const s = select(nodes[i]);
            //const target = event.currentTarget;

            // ***** Pass event handler logic to parent ***** //

            const activeItemType = selectionHasClass(s, 'chord-ribbon')
                ? 'RIBBON'
                : selectionHasClass(s, 'chord-ring')
                    ? 'RING'
                    : null;

            if (activeItemType) {
                const activeItemName = activeItemType === 'RIBBON'
                    ? `${d.source.index}.${d.target.index}`
                    : d.index;

                handleHover({
                    type: activeItemType,
                    name: activeItemName,
                    d,
                }, event.clientX, event.clientY);
            }
        }
    };

    handleMouseLeave = (d: any, i: number, nodes: any) => {
        const {allowEvents, handleUnhover} = this.props;

        if (allowEvents) {
            event.stopPropagation();

            //const s = select(nodes[i]);
            //const target = event.currentTarget;

            // ***** On mouse leave -> reset ***** //

            handleUnhover();
        }
    };

    /** ********** UTILITIES ********** **/

    getChart = () => {
        if (this.chartNodeRef && this.chartNodeRef.current) {
            return this.chartNodeRef.current
        }
        return null
    };

    /** ********** RENDER ********** **/

    render() {
        const {dataKey, chordData, size} = this.props;

        // TODO: remove in production
        //console.log(`DEBUG_MainChartRenderCount=${this.DEBUGRenderCount += 1}`);

        const svgWidth = size.width + size.margin.right + size.margin.left;
        const svgHeight = size.height + size.margin.top + size.margin.bottom;

        return (
            <div key={dataKey.toString()}
                 id="main-chart">
                {chordData
                    ? (
                        <svg width={svgWidth}
                             height={svgHeight}
                             viewBox={`${-svgWidth / 2} ${-svgHeight / 2}
                         ${svgWidth} ${svgHeight}`}>
                            <g ref={this.chartNodeRef}
                               className="chart" />
                        </svg>
                    )
                    : <ChartEmpty />}
            </div>
        )
    }
}
