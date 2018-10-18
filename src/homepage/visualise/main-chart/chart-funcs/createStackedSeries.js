// @flow

import {select} from 'd3-selection';
import {stack} from 'd3-shape';

import type {ColorData, CompanyData} from '../../../data/DataTypes';
import type {MiscCheckboxes} from '../../control-panel/Misc';

/**
 * Data type for series normally comes in the form of an array of stuff
 * */
export function getNewSeriesUE(data: any[], colorData: ColorData,
                               miscCheckboxes: MiscCheckboxes,
                               pannable: any): any[] {
    const w = miscCheckboxes.weightedAssets;

    const inflowsWeightings = {};
    const outflowsWeightings = {};
    
    // ********** 1. Stack data & keys ********** //

    const inflowsSeriesData = data.map((d) => {
        // d = one year of company data

        const annualInflows = Object.keys(d.inflows)
            .reduce((acc, curVal) => {
                if (!inflowsWeightings[curVal]) {
                    inflowsWeightings[curVal] = d.inflows[curVal].w;
                }

                acc[curVal] = w
                    ? d.inflows[curVal].amtW
                    : d.inflows[curVal].amt;

                return acc
            }, {});
        return {
            year: d.year,
            ...annualInflows,
        }
    });
    const outflowsSeriesData = data.map((d) => {
        // d = one year of company data

        const annualOutflows = Object.keys(d.outflows)
            .reduce((acc, curVal) => {
                if (!outflowsWeightings[curVal]) {
                    outflowsWeightings[curVal] = d.outflows[curVal].w;
                }

                acc[curVal] = w
                    ? d.outflows[curVal].amtW
                    : d.outflows[curVal].amt;

                return acc
            }, {});
        return {
            year: d.year,
            ...annualOutflows,

        }
    });

    // ********** 2. Stack keys ********** //

    const inflowsKeys = Object.keys(inflowsWeightings);
    const outflowsKeys = Object.keys(outflowsWeightings);

    inflowsKeys.sort((inflowA, inflowB) => {
        const sW
            = inflowsWeightings[inflowB] - inflowsWeightings[inflowA];

        if (sW !== 0) {
            return sW
        }

        return inflowA.localeCompare(inflowB, 'en', {
            sensitivity: 'base',
            ignorePunctuation: true,
            numeric: true,
        })
    });
    outflowsKeys.sort((outflowA, outflowB) => {
        const sW
            = outflowsWeightings[outflowB] - outflowsWeightings[outflowA];

        if (sW !== 0) {
            return sW
        }

        return outflowA.localeCompare(outflowB, 'en', {
            sensitivity: 'base',
            ignorePunctuation: true,
            numeric: true,
        })
    });

    // ********** 3. Stack generators ********** //

    const inflowsStackGen = stack().keys(inflowsKeys);
    const outflowsStackGen = stack().keys(outflowsKeys);

    const inflowsStack = inflowsStackGen(inflowsSeriesData);
    const outflowsStack = outflowsStackGen(outflowsSeriesData);

    // ********** 4. Stacked series ********** //

    // ***** Update ***** //

    const inflowsSeriesU = pannable.select('.vbars')
        .selectAll('.vbar-series-inflows')
        .data(inflowsStack, d => d.key);
    const outflowsSeriesU = pannable.select('.vbars')
        .selectAll('.vbar-series-outflows')
        .data(outflowsStack, d => d.key);

    // ***** Exit ***** //

    inflowsSeriesU.exit().remove();
    outflowsSeriesU.exit().remove();

    // ***** Enter & Update ***** //

    const inflowsSeriesE = inflowsSeriesU.enter();
    const outflowsSeriesE = outflowsSeriesU.enter();

    return [
        inflowsSeriesE.append('g')
            .classed('vbar-series-inflows', true)
            .merge(inflowsSeriesU),
        outflowsSeriesE.append('g')
            .classed('vbar-series-outflows', true)
            .merge(outflowsSeriesU),
    ]
}

export function coloriseSeriesUE(
    seriesUE: any,
    colorData: ColorData,
    curCompany: string,
) {
    seriesUE.attr('fill', d => colorData[curCompany][d.key]);
}
