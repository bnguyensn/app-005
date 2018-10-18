// @flow

import {axisRight} from 'd3-axis';

import {EN_UK} from './createFormats';

export default function createAxisRight(parent: any, scaleY: any) {
    const axis = axisRight(scaleY)
        .ticks(5)
        .tickFormat(EN_UK.format('.2f'));

    return parent.call(axis)
}
