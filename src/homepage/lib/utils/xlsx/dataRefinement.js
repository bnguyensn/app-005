// @flow

import type {FundData} from '../../../components/DataTypes';

/**
 * Note: the passed fundSheetData and assetSheetData must be valid i.e. have
 * gone through validation
 * */
export function refineFundData(validFundSheetData: any[], validAssetSheetData: any[]): FundData[] {
    // Convert validAssetData to something more useful
    const assetsLvl = {};
    validAssetSheetData.forEach((assetData, rowIndex) => {
        if (rowIndex > 0) {
            const [assetName, assetLvl] = assetData;
            assetsLvl[assetName] = assetLvl;
        }
    });

    const maxCol = validFundSheetData[0].length;
    const assetsCount = maxCol - 5;
    const assetNames = !assetsCount
        ? []
        : validFundSheetData[0].filter((header, colIndex) => colIndex > 4);

    const resData = [];
    validFundSheetData.forEach((fundData, rowIndex) => {
        if (rowIndex > 0) {
            resData.push({
                id: rowIndex,
                name: fundData[0],
                iCom: fundData[1],
                iCal: fundData[2],
                fCom: fundData[3],
                fCal: fundData[4],
                assets: !assetsCount
                    ? []
                    : assetNames.map((assetName, index) => ({
                        name: assetName,
                        lvl: assetsLvl[assetName] || 1,
                        amt: fundData[index + 5] || 0,
                    })),
            });
        }
    });

    return resData
}
