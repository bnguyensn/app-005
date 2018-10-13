// @flow

import {scaleLinear} from 'd3-scale';

import {findMaxInArray} from '../../../lib/array';

import type {FundData} from '../../../data/DataTypes';
import type {MiscCheckboxes} from '../../control-panel/Misc';

export default function createScaleY(
    data: FundData[],
    miscCheckboxes: MiscCheckboxes,
    chartHeight: number,
): any {
    const w = miscCheckboxes.weightedAssets;

    const dataMax = findMaxInArray(data.map(
        fundData => [
            fundData.remFCom,
            w ? fundData.totalAssetsW : fundData.totalAssets,
        ],
    ));

    // Using linear scale for y
    // y scale's range runs from negative to 0 because svg's coordinate
    // system runs from top left to bottom right
    return scaleLinear()
        .domain([0, dataMax])
        .nice()
        .range([chartHeight, 0]);
}
