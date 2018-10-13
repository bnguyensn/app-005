// @flow

import {scaleBand} from 'd3-scale';

import type {FundData} from '../../../data/DataTypes';

export default function createScaleX(
    data: FundData[],
    pannableWidth: number,
) {
    const fundNames = data.map(fundData => fundData.name);

    // Using band scale for x
    return scaleBand()
        .domain(fundNames)
        .range([0, pannableWidth])
        .padding(0.05);
}
