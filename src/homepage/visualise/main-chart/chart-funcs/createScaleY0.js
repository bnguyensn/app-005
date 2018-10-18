// @flow

import {scaleLinear} from 'd3-scale';

import {findMaxInArray} from '../../../lib/array';

import type {CompanyData} from '../../../data/DataTypes';

export default function createScaleY0(
    data: CompanyData[],
    chartHeight: number,
): any {
    const dataMax = findMaxInArray(data.map(d => (
        // 1. Data has negatives (liabilities and expenses)
        // 2. We don't want to display "negative" columns
        // Return an array of absolute value totals

        Object.values(d.total).map(t => Math.abs(t))
    )));

    // Using linear scale for y
    // y scale's range runs from negative to 0 because svg's coordinate
    // system runs from top left to bottom right
    return scaleLinear()
        .domain([0, dataMax])
        .nice()
        .range([chartHeight, 0]);
}
