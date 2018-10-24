// @flow

import {color, hsl} from 'd3-color';

import isNumber from '../../../lib/isNumber';

import type {CompanyData, ColorData} from '../Types';

export default function createColorData(
    dataset: any,
): ColorData {
    const typeColors = {
        REV: '#66BB6A',
        EXP: '#FF7043',

        NCA: '#42A5F5',
        CA: '#26A69A',
        NCL: '#FFA726',
        CL: '#FFEE58',
    };

    const typeCounts = Object.keys(typeColors)
        .reduce((acc, curVal) => {
            acc[curVal] = 0;
            return acc
        }, {});

    // Create color data based on year 0. We are assuming FSLIs are the same
    // every year

    const colorData = dataset[0].fsli.reduce((acc, curVal) => {
        const {name, type} = curVal;

        const baseHSL = hsl(typeColors[type]);
        const thisHSL = hsl(
            baseHSL.h,
            baseHSL.s,
            baseHSL.l + 0.1 * typeCounts[type],
        ).hex();

        acc[name] = color(thisHSL).hex();

        typeCounts[type] += 1;

        return acc
    }, {});

    // Add ratio colors

    colorData.profitability = '#1B5E20';
    colorData.liquidity = '#01579B';

    // Return color data

    return colorData
}
