// @flow

import type {AssetData} from '../../data/DataTypes';

/**
 * Requirements for data:
 * - No duplicated assets
 * */

type HierarchyData = {
    name: string,
    children?: HierarchyData[],
    level?: number,
    size?: number,
}

export default function createHierarchyData(data: AssetData[], w: boolean) {
    // Store asset levels encountered
    // Type: {Level N: root.children.index, ...}
    const assetLvls = {};

    const root: HierarchyData = {
        name: 'assets',
        children: [],
    };

    data.forEach((assetData) => {
        const {children: tier1} = root;

        if (tier1) {
            const curAssetLvl = `Level ${assetData.lvl}`;

            // Add asset level tier
            if (assetLvls[curAssetLvl] === undefined) {
                assetLvls[curAssetLvl] = tier1.length;
                tier1.push({
                    name: curAssetLvl,
                    children: [],
                    lvl: assetData.lvl,
                });
            }

            // Add specific asset tier
            const assetLvlObj = tier1[assetLvls[curAssetLvl]];

            const {children: tier2} = assetLvlObj;

            if (tier2) {
                tier2.push({
                    name: assetData.name,
                    lvl: assetData.lvl,
                    size: w ? assetData.amtW : assetData.amt,
                });
            }
        }
    });

    // console.log(`root hierarchy data: ${JSON.stringify(root)}`);

    return root
}
