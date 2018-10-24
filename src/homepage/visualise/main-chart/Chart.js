// @flow

import * as React from 'react';
import {select, event} from 'd3-selection';

import ChartEmpty from './ChartEmpty';

import {getHGroupsFromRibbon, getHGroupsFromRing} from '../data/helpers/helpers';
import {createHighlightStage, createNormalStage} from '../stages/createStage';
import {getSelectorFn, selectionHasClass} from './chart-funcs/helpers';
import {drawChordDiagram} from './chart-funcs/drawChordDiagram';
import animateSelection from './chart-funcs/animations/main';

import type {Data, NameData} from '../data/Types';
import type {ArcChartSize} from '../chartSizes';
import type {Stage} from '../stages/createStage';

import './chart.css';

type ChartProps = {
    dataKey: boolean,

    data: Data,
    nameData: NameData,
    colorScale: any,

    size: ArcChartSize,

    mode: string,
    stages: Stage[],
    curStage: number,

    allowEvents: boolean,

    changeState: (state: string, newState: any) => void,
    changeStates: (newStates: {}) => void,
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
        const {
            data, nameData, colorScale,
            size,
        } = this.props;

        if (data && nameData && colorScale) {
            const chartNode = this.getChart();

            if (chartNode) {
                const chart = select(chartNode);

                // ********** Redraw chart ********** //

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
                } else {
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

        this.applyStage(chart);
    };

    applyStage = (chart: any) => {
        const {stages, curStage} = this.props;
        const {selectors, animInfo} = stages[curStage];

        const selections = selectors.map(selectorObj => (
            getSelectorFn(selectorObj)(chart, selectorObj.selector)
        ));

        selections.forEach((selection, i) => {
            animateSelection(selection, animInfo[i]);
        });
    };

    /** ********** EVENTS ********** **/

    handleMouseEnter = (d: any, i: number, nodes: any) => {
        const {allowEvents} = this.props;

        if (allowEvents) {
            const {data, changeState} = this.props;

            event.stopPropagation();

            const s = select(nodes[i]);
            const target = event.currentTarget;

            // ***** Select stuff ***** //

            let hRingsG, hRibbonsG, targetRingIndex, targetRibbonName;

            if (selectionHasClass(s, 'chord-ribbon')) {
                [hRingsG, hRibbonsG] = this.getHoveredGroupsRibbons(data, d);
                targetRibbonName = [`${d.source.index}.${d.target.index}`]
            } else if (selectionHasClass(s, 'chord-ring')) {
                [hRingsG, hRibbonsG] = this.getHoveredGroupsRings(data, d);
                targetRingIndex = [d.index];
            }

            // ***** If stuffs are not undefined, perform actions ***** //

            if (hRingsG && hRibbonsG) {
                const nextStage = createHighlightStage(hRingsG, hRibbonsG);

                nextStage.evtInfo = {
                    type: 'mouseenter',
                    hRingsG,
                    hRibbonsG,
                    targetRingIndex,
                    targetRibbonName,
                };

                changeState('stages', [nextStage]);
            }
        }
    };

    handleMouseLeave = (d: any, i: number, nodes: any) => {
        const {allowEvents} = this.props;

        if (allowEvents) {
            const {data, changeState} = this.props;

            event.stopPropagation();

            const s = select(nodes[i]);
            const target = event.currentTarget;

            // ***** On mouse leave -> reset ***** //

            const nextStage = createNormalStage();

            changeState('stages', [nextStage]);
        }
    };

    getHoveredGroupsRings = (data: Data, d: any): any[] => {
        return getHGroupsFromRing(data, d.index)
    };

    getHoveredGroupsRibbons = (data: Data, d: any): any[] => {
        return getHGroupsFromRibbon(data, d.source.index, d.target.index)
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
