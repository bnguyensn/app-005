// @flow

export type ColorData = {
    assets: {[key: string]: string},  // {asset name: color, ...}
    assetLvls: {[key: string]: string}  // {asset level: color, ...}
}

export type AssetData = {
    name: string,
    lvl: number,  // Lower = more liquid
    w: number,  // Asset's weighting
    amt: number,  // Amount
    amtW: number,  // amt x w
};

export type FundData = {
    id: number,
    name: string,
    dispName: string,
    iCom: number,  // Investors' commitments
    iCal: number,  // Investors' money already called
    fCom: number,  // Fund's commitments in investments
    fCal: number,  // Fund's commitments in investments already called
    assets: AssetData[],
    totalAssets: number,  // Total fund's assets
    totalAssetsW: number,  // Total fund's assets (weighted)
    remFCom: number,  // Fund's remaining investment commitments not yet called
    goingConcern: number,  // Ratio of totalAssets / remFCom

    // Ranking of this fund in whatever field (sortKey) there is
    sortIndices: {[key: string]: {asc: number, des: number}},
};
