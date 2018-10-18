// @flow

import {axisLeft} from 'd3-axis';
import {formatPrefix} from 'd3-format';

import {EN_UK} from './createFormats';

export default function createAxisLeft(parent: any, scaleY: any) {
    const axis = axisLeft(scaleY)
        .ticks(5)
        .tickFormat(EN_UK.format('$~s'));
        //.tickFormat(EN_UK.formatPrefix('$~s', 1e6));

    const aL = parent.call(axis);

    /*const p = document.getElementsByClassName('y0-axis');
    console.log(p);*/
    console.log(parent.selectAll('text'));
    // parent.selectAll('text').text()
}
