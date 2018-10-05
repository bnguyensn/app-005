// @flow

import {AssetData} from '../../../components/DataTypes';

import defaultColorBank from '../../../json/default-color-bank';

/**
 * Generate a default color scheme for a given array of assets.
 *
 * The returned object has asset names for keys and color strings for values.
 *
 * Note: the assets array should have already been validated
 * */
export default function createColorData(
    assets: AssetData[],
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

    const colorData = sortedAssets.reduce((acc, curVal, i) => {
        acc[curVal.name] = defaultColorBank[i % defaultColorBank.length];
        return acc
    }, {});

    colorData['Remaining investment commitments'] = '#63201E';

    return colorData
}
