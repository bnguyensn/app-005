// @flow

import {sortData} from '../dataMutation';

import type {FundData} from '../../../components/DataTypes';

/**
 * Convert validAssetData to something more useful
 *
 * Note: the passed fundSheetData and assetSheetData must be valid i.e. have
 * gone through validation
 * */
export default function refineFundData(fundSheetData: any[],
                                       assetSheetData: any[]): FundData[] {
    // ********** Create asset names array ********** //
    // Type: [assetName1, ...]

    // By our specification, asset data in the fund sheet starts from column 5
    const assetIndexStart = 5;

    const assetNames = fundSheetData[0].length - assetIndexStart > 0
        ? fundSheetData[0].filter((v, colIndex) => colIndex >= assetIndexStart)
        : [];

    console.log(`assetNames = ${assetNames}`);

    // ********** Create asset levels object ********** //
    // Type: {assetName: assetLvl, ...}

    const assetLevels = {};

    assetSheetData
        .filter((assetData, rowIndex) => rowIndex > 0)
        .forEach((assetData) => {
            const [assetName, assetLvl] = assetData;
            assetLevels[assetName] = assetLvl;
        });

    // ********** Create refined fund data ********** //

    const fundData = fundSheetData
        .filter((fundData, rowIndex) => rowIndex > 0)
        .map((fundData, rowIndex) => {
            // Create a short display name for the fund in case its name is too
            // long

            const cutOff = 7;
            const dispName = fundData[0].length > cutOff
                ? `${fundData[0].slice(0, cutOff - 2)}..`
                : fundData[0];

            // Create this fund's asset array. Could be empty if there are no
            // assets based on the headers

            const assets = assetNames.length > 0
                ? assetNames.map((assetName, index) => ({
                    name: assetName,

                    // Any asset found in the fund sheet but not found in the
                    // asset sheet has level = 1
                    lvl: assetLevels[assetName] || 1,

                    amt: fundData[index + assetIndexStart],
                }))
                : [];

            // Create this fund's misc. data for sorting function

            const totalAssets = assets.reduce(
                (acc, curVal) => acc + curVal.amt, 0,
            );
            const remFCom = Math.max(fundData[3] - fundData[4], 0);
            const goingConcern = remFCom !== 0
                ? totalAssets / remFCom
                : 1;

            // Return refined data

            return {
                id: rowIndex,
                name: fundData[0],
                dispName,
                iCom: fundData[1],
                iCal: fundData[2],
                fCom: fundData[3],
                fCal: fundData[4],
                assets,
                totalAssets,
                remFCom,
                goingConcern,
                sortIndices: {},
            }
        });

    // Create sort indices

    const sortKeys = ['name', 'goingConcern', 'remFCom', 'totalAssets'];

    const sortedArrs = sortKeys.map((sortKey) => {
        const arrToSort = fundData.map(f => ({
            ogIndex: f.id,
            k: sortKey,
            [sortKey]: f[sortKey],
        }));

        // Will return null if cannot sort
        const sortedArr = sortKey !== 'goingConcern'
            ? sortData(arrToSort, sortKey)
            : sortData(arrToSort, sortKey, false);

        return sortedArr || arrToSort
    });

    // Warning: fundData mutation below
    sortedArrs.forEach((sortedArr) => {
        sortedArr.forEach((obj, i) => {
            const {ogIndex, k} = obj;
            fundData[ogIndex].sortIndices[k] = i;
        });
    });

    return fundData
}
