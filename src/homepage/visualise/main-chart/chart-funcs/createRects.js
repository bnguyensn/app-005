// @flow

import {transition} from 'd3-transition';

import type {CompanyData} from '../../../data/DataTypes';
import type {ArcChartSize} from '../../chartSizes';

function getRectY(a: number, b: number, scaleY: any): number {
    // a.k.a. start y
    return scaleY(b)
}

function getRectHeight(a: number, b: number, scaleY: any): number {
    // a.k.a. end y - start y

    return Math.abs(scaleY(a) - scaleY(b))
}

export default function createRects(
    seriesUE: any,
    size: ArcChartSize,
    scaleX: any,
    scaleY: any,
    xPosOffset: number,
    xPosTotal: number,
    onMEnter: (d: any, i: number, nodes: any) => void,
    onMLeave: () => void,
    onMClick: (CompanyData) => void,
) {
    // ***** Update ***** //

    const rectU = seriesUE.selectAll('rect')
        .data(d => d, d => d.data.year);

    // ***** Exit ***** //

    const rectX = rectU.exit();

    const transRectX = rectX.transition()
        .duration(500);
    transRectX.attr('x', size.width + size.margin.right + size.margin.left)
        .attr('fill-opacity', 0)
        .remove();

    rectX.on('mouseenter', null);
    rectX.on('mouseleave', null);
    rectX.on('click', null);

    // ***** Enter & Update ***** //

    const rectE = rectU.enter()
        .append('rect');
    rectE.attr('y', scaleY(0))
        .attr('x', scaleX.range()[1])
        .attr('fill-opacity', 0);

    const rectUE = rectE
        .classed('fsli-bar', true)
        .merge(rectU);

    const transRectUE = rectUE.transition()
        .duration(500);
    transRectUE.attr('y', d => getRectY(d[0], d[1], scaleY))
        .attr('width', scaleX.bandwidth() / xPosTotal)
        .attr('height', d => getRectHeight(d[0], d[1], scaleY))
        .attr('x', d => (
            scaleX(d.data.year)
            + (scaleX.bandwidth() / xPosTotal) * xPosOffset
        ))
        .attr('fill-opacity', 1);

    rectUE.on('mouseenter', onMEnter);
    rectUE.on('mouseleave', onMLeave);
    rectUE.on('click', onMClick);
}
