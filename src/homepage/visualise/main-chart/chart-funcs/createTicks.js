// @flow

import {range} from 'd3-array';

export default function createTicks(d: any, step: number) {
    const k = (d.endAngle - d.startAngle) / d.value;

    return range(0, d.value, step).map(value => ({
        angle: value * k + d.startAngle,
        value,
    }))
}
