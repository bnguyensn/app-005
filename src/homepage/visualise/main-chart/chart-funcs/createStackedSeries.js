// @flow

import {select} from 'd3-selection';
import {stack} from 'd3-shape';

import type {ColorData, FundData} from '../../../data/DataTypes';
import type {MiscCheckboxes} from '../../control-panel/Misc';

function createStackedSeries(
    data: FundData[],
    miscCheckboxes: MiscCheckboxes,
): any {
    const w = miscCheckboxes.weightedAssets;

    // Create stack data
    const stackData = data.map((fundData) => {
        const fundObj = {};
        fundObj.name = fundData.name;
        fundData.assets.forEach((asset) => {
            fundObj[asset.name] = w ? asset.amtW : asset.amt;
        });
        fundObj.fundData = fundData;
        return fundObj
    });

    // Create stack keys
    const anAssetsObj = data[0].assets;
    const compareFn = (a, b) => {
        if (a.lvl === b.lvl) {
            return a.name.localeCompare(b.name, 'en', {
                sensitivity: 'base',
                ignorePunctuation: true,
                numeric: true,
            })
        }
        return a.lvl - b.lvl
    };
    anAssetsObj.sort(compareFn);
    const stackKeys = anAssetsObj.map(asset => asset.name);

    // Create stack generator
    const stackGen = stack()
        .keys(stackKeys);

    // Return stack
    return stackGen(stackData)
}

export function getNewSeriesUE(data: FundData[], colorData: ColorData,
                               miscCheckboxes: MiscCheckboxes,
                               pannable: any): any {
    const stackedSeries = createStackedSeries(data, miscCheckboxes);

    const seriesU = pannable.select('.vbars')
        .selectAll('.vbar-series')
        .data(stackedSeries, d => d.key);

    seriesU.exit().remove();

    const seriesE = seriesU.enter();
    return seriesE.append('g')
        .classed('vbar-series clearable', true)
        .merge(seriesU);
}

export function coloriseSeriesUE(seriesUE: any, colorData: ColorData) {
    seriesUE.attr('fill', d => colorData.assets[d.key]);
}
