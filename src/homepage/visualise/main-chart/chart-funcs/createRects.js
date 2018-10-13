// @flow

import {transition} from 'd3-transition';

import type {FundData} from '../../../data/DataTypes';
import type {MainChartSize} from '../../chartSizes';

export default function createRects(
    seriesUE: any,
    size: MainChartSize,
    scaleX: any,
    scaleY: any,
    showTooltip: (d: any, i: number, nodes: any) => void,
    hideTooltip: () => void,
    onFundClick: (FundData) => void,
) {
    const getRectHeight = (a, b) => scaleY(scaleY.domain()[1] - (b - a));

    const getRectY = (a, b) => scaleY(a) - getRectHeight(a, b);

    const rectU = seriesUE.selectAll('rect')
        .data(d => d, d => d.data.name);

    const rectX = rectU.exit();

    const transRectX = rectX.transition().duration(500);
    transRectX.attr('x', size.width + size.margin.right + size.margin.left)
        .remove();

    rectX.on('mouseenter', null);
    rectX.on('mouseleave', null);
    rectX.on('click', null);

    const rectE = rectU.enter();

    const rectUE = rectE.append('rect')
        .classed('asset-bar', true)
        .merge(rectU);

    const transRectUE = rectUE.transition().duration(500);
    transRectUE.attr('y', d => getRectY(d[0], d[1]))
        .attr('width', scaleX.bandwidth())
        .attr('height', d => getRectHeight(d[0], d[1]))
        .attr('x', d => scaleX(d.data.name));

    rectUE.on('mouseenter', showTooltip);
    rectUE.on('mouseleave', hideTooltip);
    rectUE.on('click', onFundClick);
}
