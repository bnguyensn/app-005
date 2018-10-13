// @flow

import {axisLeft} from 'd3-axis';

import {EN_UK} from './createFormats';

export default function createAxisLeft(parent: any, scaleY: any) {
    const axis = axisLeft(scaleY)
        .ticks(5)
        .tickFormat(EN_UK.format('$~s'));

    return parent.call(axis)
}
