// @flow

export type ColorData = {[key: string]: string}  // {asset name: color, ...}

export type AssetData = {
    name: string,
    lvl: number,  // Lower = more liquid
    amt: number,
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
    remFCom: number,  // Fund's remaining investment commitments not yet called
    goingConcern: number,  // Ratio of totalAssets / remFCom

    // Ranking of this fund in whatever field there is
    sortIndices: {[key: string]: number},
};
