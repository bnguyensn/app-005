// @flow

import {axisBottom} from 'd3-axis';
import type {CompanyData} from '../../../data/DataTypes';

export default function createAxisBottom(
    data: CompanyData[],
    parent: any,
    scaleX: any,
    scaleY: any,
) {
    // Note: band and point scales do not implement scale.ticks

    const axis = axisBottom(scaleX)
        .tickFormat(d => d);

    return parent.attr('transform', `translate(0, ${scaleY(0)})`)
        .call(axis);
}
