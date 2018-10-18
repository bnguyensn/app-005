// @flow

import {scaleLinear} from 'd3-scale';

import {findMaxInArray, findMinInArray} from '../../../lib/array';

import type {CompanyData} from '../../../data/DataTypes';

export default function createScaleY1(
    data: CompanyData[],
    chartHeight: number,
): any {
    const dataMax = findMaxInArray(data.map(d => (
        // 1. Data does not have negatives
        // Return an array of ratios

        Object.values(d.ratio)
    )));

    // Using linear scale for y
    // y scale's range runs from negative to 0 because svg's coordinate
    // system runs from top left to bottom right
    return scaleLinear()
        .domain([0, dataMax])
        .nice()
        .range([chartHeight, 0]);
}
