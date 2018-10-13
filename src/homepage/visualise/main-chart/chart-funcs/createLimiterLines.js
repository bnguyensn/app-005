// @flow

import {line} from 'd3-shape';
import {transition} from 'd3-transition';

import type {ColorData, FundData} from '../../../data/DataTypes';

type Line2Points = [[number, number], [number, number]];

type LineData = {
    name: string,
    amount: number,
    points: Line2Points,
    fundData: FundData,
    d: string,
};

const lineGen = line().defined(d => d !== null);

function createLineData(
    data: FundData[],
    xScale: any,
    yScale: any,
): LineData[] {
    return data.map((fundData) => {
        const valueHeight = yScale(fundData.remFCom);

        // Create an array of starting and ending points
        const points = [
            // start [x, y]
            [xScale(fundData.name), valueHeight],

            // end [x, y]
            [xScale(fundData.name) + xScale.bandwidth(), valueHeight],
        ];

        // Return a line data object associated with each fund
        return {
            name: 'Remaining investment commitments',
            amount: fundData.remFCom,
            points,
            fundData,
            d: lineGen(points),
        }
    });
}

export function getPathUE(
    data: FundData[],
    scaleX: any,
    scaleY: any,
    pannable: any,
    height: number,  // Pannable size height
    showTooltip: (d: any, i: number, nodes: any) => void,
    hideTooltip: () => void,
    onFundClick: (FundData) => void,
): any {
    const lineData = createLineData(data, scaleX, scaleY);

    // Lines

    const pathU = pannable.select('.limit-lines')
        .selectAll('.limit-line')
        .data(lineData, d => d.name);

    const pathX = pathU.exit();

    const transPathX = pathX.transition().duration(500);
    transPathX.attr('transform', `translate(0, -${height})`)
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
        .attr('transform', `translate(0, ${height})`)
        .attr('stroke-opacity', 0)
        .attr('stroke-width', 5);

    const transPathUE = pathUE.transition().duration(500);
    transPathUE.attr('transform', 'translate(0, 0)')
        .attr('stroke-opacity', 1);

    pathUE.on('mouseenter', showTooltip);
    pathUE.on('mouseleave', hideTooltip);
    pathUE.on('click', onFundClick);

    return pathUE
}

export function colorisePathUE(pathUE: any, colorData: ColorData) {
    pathUE.attr('stroke', colorData.assets['Remaining investment commitments']);
}
