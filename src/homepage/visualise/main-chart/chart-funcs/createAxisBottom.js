// @flow

import {axisBottom} from 'd3-axis';
import type {FundData} from '../../../data/DataTypes';

export default function createAxisBottom(data: FundData[], parent: any,
                                         scaleX: any) {
    // Note: band and point scales do not implement scale.ticks

    const dispNameMapper = {};
    data.forEach((fundData) => {
        dispNameMapper[fundData.name] = fundData.dispName;
    });

    const axis = axisBottom(scaleX)
        .tickFormat(d => dispNameMapper[d]);

    return parent.call(axis);
}