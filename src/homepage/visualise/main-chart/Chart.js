// @flow

import * as React from 'react';
import {select, event} from 'd3-selection';

import ChartEmpty from './ChartEmpty';

import {drawChordDiagram, highlightChordRibbons, highlightChordRings}
    from './chart-funcs/drawChordDiagram';
import createColorScale from './chart-funcs/createColorScale';
import {selectionHasClass} from './chart-funcs/helpers';
import {isArrayEqual} from '../../lib/array';

import type {Data, NameData} from '../../data/DataTypes';
import type {ArcChartSize} from '../chartSizes';
import type {Stage} from '../stages/createStage';

import './chart.css';


type ChartProps = {
    dataKey: boolean,

    data: ?Data,
    nameData: ?NameData,
    colorScale: any,

    size: ArcChartSize,

    mode: 'normal' | 'walkthrough',
    stages: Stage[],
    curStage: number,

    allowEvents: boolean,

    changeState: (state: string, newState: any) => void,
};

export default class Chart
    extends React.PureComponent<ChartProps, {}> {
    // React refs
    chartNodeRef: any;

    // DOM refs
    ringsCtn: any;
    ribbonsCtn: any;

    // D3.js - Scales & axes


    // D3.js - Shapes - Store this to isolate color changing activities
    chordRings: any;
    chordRibbons: any;

    // DEBUG  // TODO: remove in production
    DEBUGRenderCount: number;

    constructor(props: ChartProps) {
        super(props);

        this.DEBUGRenderCount = 0;  // TODO: remove in production

        this.chartNodeRef = React.createRef();
    }

    componentDidMount() {
        const {
            data, nameData, colorScale,
            size,
        } = this.props;

        if (data && nameData && colorScale) {
            const chartNode = this.getChart();

            if (chartNode) {
                const chart = select(chartNode);

                // ********** Update chart ********** //

                this.redrawChart(chart);
            }
        }
    }

    componentDidUpdate(prevProps: ChartProps, prevState: {}, snapshot: any) {
        const {
            dataKey: prevDataKey,
            data: prevData,
            stages: prevStages,
            curStage: prevCurStage,
        } = prevProps;
        const {
            dataKey,
            data, nameData, colorScale,
            size,
            stages, curStage,
        } = this.props;

        if (data && nameData && colorScale) {
            const chartNode = this.getChart();

            if (chartNode) {
                const chart = select(chartNode);

                if (prevData === null
                    || (prevDataKey !== dataKey)) {
                    // ********** Redraw chart ********** //

                    this.redrawChart(chart);
                } else if (prevCurStage !== curStage
                    || !isArrayEqual(prevStages, stages)) {
                    // ********** Update chart ********** //

                    this.applyStage(chart);
                }
            }
        }
    }

    /** ********** CHART DRAWINGS / UPDATES ********** **/

    redrawChart = (chart: any) => {
        const {data, nameData, colorScale, size} = this.props;

        // ***** Remove clearables ***** //

        chart.selectAll('.clearable')
            .remove();

        // ***** Draw chord diagram ***** //

        const chordDiagramEA = [
            {event: 'mouseenter', action: this.handleMouseEnter},
            {event: 'mouseleave', action: this.handleMouseLeave},
        ];

        const {chordRings, chordRibbons} = drawChordDiagram(
            chart, data, nameData, colorScale, size, chordDiagramEA,
        );

        this.chordRings = chordRings;
        this.chordRibbons = chordRibbons;

        this.ringsCtn = select(document.getElementById('chord-rings'));
        this.ribbonsCtn = select(document.getElementById('chord-ribbons'));

        this.applyStage(chart);
    };

    applyStage = (chart: any) => {
        console.log('applying stage!');

        const {stages, curStage} = this.props;
        const {
            activeRings, activeRibbons,
            activeOpacity, passiveOpacity,
            ringsStagger, ribbonsStagger,
            ringsDuration, ribbonsDuration,
        } = stages[curStage];

        highlightChordRings(chart, activeRings, ringsStagger,
            activeOpacity, passiveOpacity,
            ringsDuration);
        highlightChordRibbons(chart, activeRibbons, ribbonsStagger,
            activeOpacity, passiveOpacity,
            ribbonsDuration);
    };

    /** ********** EVENTS ********** **/

    handleMouseEnter = (d: any, i: number, nodes: any) => {
        const {allowEvents} = this.props;

        if (allowEvents) {
            const {nameData, changeState} = this.props;

            event.stopPropagation();

            const s = select(nodes[i]);
            const target = event.currentTarget;

            // ***** Part 1 ***** //

            if (selectionHasClass(s, 'chord-ribbon')) {
                const nameT = nameData[d.target.index];
                const nameS = nameData[d.source.index];

                const ringsTS = this.ringsCtn.selectAll(
                    `.chord-ring.name-${nameT}, .chord-ring.name-${nameS}`,
                );

                this.highlightSelection(ringsTS);
            } else if (selectionHasClass(s, 'chord-ring')) {
                const name = nameData[d.index];
                const namesT = new Set();

                const ribbonsInOut = this.ribbonsCtn.selectAll(
                    `.chord-ribbon.name-s-${name}, .chord-ribbon.name-t-${name}`,
                );
                ribbonsInOut.each(d => namesT.add(nameData[d.target.index]));

                const ringsOutSelector = Array.from(namesT)
                    .map(n => `.chord-ring.name-${n}`)
                    .join(', ');
                const ringsOut = this.ringsCtn.selectAll(ringsOutSelector);

                this.highlightSelection(ribbonsInOut);
                this.highlightSelection(ringsOut);
            }

            this.highlightSelection(s);

            // ***** Part 2 ***** //

            changeState('chartData', JSON.parse(JSON.stringify(d)));
        }
    };

    handleMouseLeave = (d: any, i: number, nodes: any) => {
        const {allowEvents} = this.props;

        if (allowEvents) {
            const {nameData} = this.props;

            event.stopPropagation();

            const s = select(nodes[i]);
            const target = event.currentTarget;

            if (selectionHasClass(s, 'chord-ribbon')) {
                const nameT = nameData[d.target.index];
                const nameS = nameData[d.source.index];

                const ringsTS = this.ringsCtn.selectAll(
                    `.chord-ring.name-${nameT}, .chord-ring.name-${nameS}`,
                );

                this.unHighlightSelection(ringsTS);
            } else if (selectionHasClass(s, 'chord-ring')) {
                const name = nameData[d.index];
                const namesT = new Set();

                const ribbonsInOut = this.ribbonsCtn.selectAll(
                    `.chord-ribbon.name-s-${name}, .chord-ribbon.name-t-${name}`,
                );
                ribbonsInOut.each(d => namesT.add(nameData[d.target.index]));

                const ringsOutSelector = Array.from(namesT)
                    .map(n => `.chord-ring.name-${n}`)
                    .join(', ');
                const ringsOut = this.ringsCtn.selectAll(ringsOutSelector);

                this.unHighlightSelection(ribbonsInOut);
                this.unHighlightSelection(ringsOut);
            }

            this.unHighlightSelection(s);
        }
    };

    highlightSelection = (sel: any) => {
        sel.classed('active', true);
    };

    unHighlightSelection = (sel: any) => {
        sel.classed('active', false);
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
        const {
            dataKey, data, nameData, colorScale, size,
        } = this.props;

        // TODO: remove in production
        console.log(`DEBUG_MainChartRenderCount=${this.DEBUGRenderCount += 1}`);

        const svgWidth = size.width + size.margin.right + size.margin.left;
        const svgHeight = size.height + size.margin.top + size.margin.bottom;

        return (
            <div key={dataKey.toString()}
                 id="main-chart">
                {data
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
