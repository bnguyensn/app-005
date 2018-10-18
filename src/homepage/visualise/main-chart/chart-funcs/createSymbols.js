// @flow

import {symbol, symbolCircle, line} from 'd3-shape';

import type {ColorData, CompanyData} from '../../../data/DataTypes';
import type {MiscCheckboxes} from '../../control-panel/Misc';

const symbolGen = symbol()
    .type(symbolCircle)
    .size(100);

const lineGen = line().defined(d => d !== null);

export function getSymbolsUE(
    data: CompanyData[],
    colorData: ColorData,
    miscCheckboxes: MiscCheckboxes,
    pannable: any,
    scaleX: any,
    scaleY: any,
    onMEnter: (d: any, i: number, nodes: any) => void,
    onMLeave: () => void,
    onMClick: () => void,
): any[] {
    // ********** 1. Symbols ********** //

    const symbolData = data.map((d) => {
        const amount = miscCheckboxes.weightedAssets
            ? d.headroomW
            : d.headroom;

        return {
            name: 'Headroom',
            amount,
            posX: scaleX(d.year) + scaleX.bandwidth() / 2,
            posY: scaleY(amount),
            d: symbolGen(),
        }
    });

    // ***** Update ***** //

    const symbolsU = pannable.select('.headrooms')
        .selectAll('.headroom')
        .data(symbolData, d => d.name);

    // ***** Exit ***** //

    const symbolsX = symbolsU.exit();

    symbolsX.on('mouseenter', null);
    symbolsX.on('mouseleave', null);
    symbolsX.on('click', null);
    
    // ***** Enter & Update ***** //

    const symbolsE = symbolsU.enter();

    const symbolsUE = symbolsE.append('path')
        .classed('headroom clearable', true)
        .merge(symbolsU);

    symbolsUE.attr('d', d => d.d)
        .attr('stroke-opacity', 1)
        .attr('stroke-width', 5)
        .attr('transform', d => `translate(${d.posX}, ${d.posY})`);

    symbolsUE.on('mouseenter', onMEnter);
    symbolsUE.on('mouseleave', onMLeave);
    symbolsUE.on('click', onMClick);
    
    // ********** 2. Lines ********** //

    const lineData = symbolData.map(d => [d.posX, d.posY]);

    const lineD = lineGen(lineData);  // This is the path's d

    const symbolLine = pannable.select('.headrooms')
        .insert('path', ':first-child')
        .classed('headroom-line clearable', true)
        .attr('d', lineD)
        .attr('fill-opacity', 0)
        .attr('stroke-width', 2);

    return [symbolsUE, symbolLine]
}

export function coloriseSymbolsUE(
    el: any,
    colorData: ColorData,
    curCompany: string,
) {
    el.attr('stroke', colorData[curCompany].Headroom);
    el.attr('fill', colorData[curCompany].Headroom);
}

export function coloriseSymbolLinesUE(
    el: any,
    colorData: ColorData,
    curCompany: string,
) {
    el.attr('stroke', colorData[curCompany].Headroom);
}
