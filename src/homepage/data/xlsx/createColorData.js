// @flow

import {color, hsl} from 'd3-color';

import type {AssetData, FundData, ColorData} from '../DataTypes';

import defaultColorBank02 from '../json/default-color-bank-02';

/**
 * Generate a default color scheme for a given array of asset levels.
 *
 * The returned object has Type: {n: colorString, ...}.
 *
 * Note: the asset levels array should have already been validated
 * */
function createAssetLvlColorData(
    assetLvls: string[],
): {[key: string]: string} {
    const sortedAssetLvls = [...assetLvls].sort();

    const baseColor = hsl(defaultColorBank02[0]);

    return sortedAssetLvls.reduce((acc, curVal, i) => {
        const cHSL = hsl(baseColor.h + i * 30, baseColor.s, baseColor.l);
        acc[curVal] = color(cHSL).hex();
        return acc
    }, {})
}

/**
 * Generate a default color scheme for a given array of assets.
 *
 * The returned object has Type: {assetName: colorString, ...}.
 *
 * Note: the assets array should have already been validated
 * */
function createAssetColorData(
    assets: AssetData[],
    assetLvlsColor: {[key: string]: string},
): {[key: string]: string} {
    const sortedAssets = assets.length > 0
        ? [...assets].sort((assetA, assetB) => {
            // Compare asset names if their levels are equal

            if (assetA.lvl === assetB.lvl) {
                return assetA.name.localeCompare(assetB.name, 'en', {
                    sensitivity: 'base',
                    ignorePunctuation: true,
                    numeric: true,
                })
            }

            // Else compare asset levels

            return assetA.lvl - assetB.lvl
        })
        : [];

    const lvlCounts = Object.keys(assetLvlsColor).reduce((acc, curVal) => {
        acc[curVal] = 0.05;
        return acc
    }, {});

    const colorData = sortedAssets.reduce((acc, curVal, i) => {
        const lvlCHSL = hsl(assetLvlsColor[curVal.lvl]);

        const lOffset = lvlCounts[curVal.lvl];
        lvlCounts[curVal.lvl] += 0.05;

        const cHSL = hsl(lvlCHSL.h, lvlCHSL.s, lvlCHSL.l + lOffset);
        acc[curVal.name] = color(cHSL).hex();
        return acc
    }, {});

    colorData['Remaining investment commitments'] = '#63201E';

    return colorData
}

/**
 * Generate the colorData object
 * */
export default function createColorData(data: FundData[]): ColorData {
    const assetLvlsObj = data[0].assets
        .reduce((acc, curVal) => {
            if (acc[curVal.lvl] === undefined) {
                acc[curVal.lvl] = curVal.lvl;
            }
            return acc
        }, {});

    const colorDataAssetLvls = createAssetLvlColorData(
        Object.values(assetLvlsObj),
    );

    const colorDataAssets = createAssetColorData(
        data[0].assets,
        colorDataAssetLvls,
    );

    return {
        assets: colorDataAssets,
        assetLvls: colorDataAssetLvls,
    }
}
