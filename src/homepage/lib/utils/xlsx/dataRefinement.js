// @flow

import type {FundData} from '../../../components/DataTypes';

/**
 * Convert validAssetData to something more useful
 *
 * Note: the passed fundSheetData and assetSheetData must be valid i.e. have
 * gone through validation
 * */
export function refineFundData(validFundSheetData: any[], validAssetSheetData: any[]): FundData[] {
    // Create asset level object

    const assetsLvl = {};
    validAssetSheetData.forEach((assetData, rowIndex) => {
        if (rowIndex > 0) {
            const [assetName, assetLvl] = assetData;
            assetsLvl[assetName] = assetLvl;
        }
    });

    // Create asset names array

    const maxCol = validFundSheetData[0].length;
    const assetsCount = maxCol - 5;
    const assetNames = !assetsCount
        ? []
        : validFundSheetData[0].filter((header, colIndex) => colIndex > 4);

    // Create refined data

    return validFundSheetData
        .filter((fundData, rowIndex) => rowIndex > 0)
        .map((fundData, rowIndex) => {
            // Create a short display name for the fund in case its name is too
            // long

            const cutOff = 7;
            const dispName = fundData[0].length > cutOff
            ? `${fundData[0].slice(0, cutOff - 2)}..`
            : fundData[0];

            // Create this fund's asset array

            const assets = !assetsCount
                ? []
                : assetNames.map((assetName, index) => ({
                    name: assetName,
                    lvl: assetsLvl[assetName] || 1,
                    amt: fundData[index + 5] || 0,
                }));

            // Create this fund's misc. data for sorting function

            const totalAssets = assets.reduce(
                (acc, curVal) => acc + curVal.amt, 0,
            );
            const remFCom = Math.max(fundData[3] - fundData[4], 0);
            const goingConcern = remFCom / totalAssets;

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
            }
        });
}
