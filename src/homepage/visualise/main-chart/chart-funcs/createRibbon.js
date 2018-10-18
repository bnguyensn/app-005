// @flow

import {ribbon} from 'd3-chord';

import type {ArcChartSize} from '../../chartSizes';

export default function createRibbon(size: ArcChartSize) {
    return ribbon()
        .radius(size.innerRadius)
}
