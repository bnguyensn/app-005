// @flow

import {scaleOrdinal} from 'd3-scale';
import {range} from 'd3-array';

import type {ColorData} from '../../../data/DataTypes';

export type ColorScale = <T>(value: T) => T

export default function createColorScale(colorData: ColorData): ColorScale {
    return scaleOrdinal()
        .domain(range(colorData.length))
        .range(colorData)
}
