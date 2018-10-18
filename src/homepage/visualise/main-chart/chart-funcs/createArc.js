// @flow

import {arc} from 'd3-shape';

import type {ArcChartSize} from '../../chartSizes';

export default function createArc(size: ArcChartSize) {
    return arc()
        .innerRadius(size.innerRadius)
        .outerRadius(size.outerRadius);
}
