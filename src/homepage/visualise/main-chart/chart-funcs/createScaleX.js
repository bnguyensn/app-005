// @flow

import {scaleBand} from 'd3-scale';

import type {CompanyData} from '../../../data/DataTypes';

export default function createScaleX(
    data: CompanyData[],
    pannableWidth: number,
) {
    const years = data.map(d => d.year);

    // Using band scale for x
    return scaleBand()
        .domain(years)
        .range([0, pannableWidth])
        .padding(0.1);
}
