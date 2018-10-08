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

    // ********** Create asset levels object ********** //
    // Type: {assetName: assetLvl, ...}

    const assetLevels = {};

    assetSheetData
        .filter((assetData, rowIndex) => rowIndex > 0)
        .forEach((assetData) => {
            const [assetName, assetLvl] = assetData;
            assetLevels[assetName] = assetLvl;
        });

    // ********** Create refined fund data (no sort indices yet) ********** //

    const fundDataNoSortIndices = fundSheetData
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
                sortIndices: {
                    name: {asc: 0, des: 0},
                    goingConcern: {asc: 0, des: 0},
                    remFCom: {asc: 0, des: 0},
                    totalAssets: {asc: 0, des: 0},
                },
            }
        });

    // ********** Create sort indices ********** //

    // Sort indices Type: {a_IndexA: number, d_IndexA: number, ...}

    const sortKeys = Object.keys(fundDataNoSortIndices[0].sortIndices);

    // Generate a sort array object for N sortKey. The sort array object
    // contains N number of fund object arrays, which in turn contains sorting
    // information for each fund.
    // Type: {sortKey: [fundObj, ...], ...}

    const sortArrsObj = sortKeys.reduce((acc, sortKey) => {
        acc[sortKey] = fundDataNoSortIndices.map(f => ({
            id: f.id,
            k: sortKey,
            value: f[sortKey],
        }));
        return acc
    }, {});

    // Sort the each fund object array in sortArrsObj, creating an object
    // containing an ascending sort and a descending sort array for each
    // sortKey.

    const sortedArrsObj = Object.keys(sortArrsObj).reduce((acc, sortKey) => {
        const sortedAsc = sortData(sortArrsObj[sortKey], 'value', true)
            || sortArrsObj[sortKey];
        const sortedDes = [...sortedAsc].reverse();
        acc[sortKey] = {
            asc: sortedAsc,
            des: sortedDes,
        };
        return acc
    }, {});

    // Finally, bring sortedArrsObj into fundDataNoSortIndices

    Object.keys(sortedArrsObj).forEach((sortKey) => {
        const sortedAsc = sortedArrsObj[sortKey].asc;
        const sortedDes = sortedArrsObj[sortKey].des;

        sortedAsc.forEach((f, i) => {
            fundDataNoSortIndices[f.id].sortIndices[sortKey].asc = i;
        });
        sortedDes.forEach((f, i) => {
            fundDataNoSortIndices[f.id].sortIndices[sortKey].des = i;
        });
    });

    // ********** End of refinement ********** //

    return fundDataNoSortIndices
}
