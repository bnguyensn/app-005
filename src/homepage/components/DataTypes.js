// @flow

export type ColorData = {[key: string]: string}

export type AssetData = {
    name: string,
    lvl: number,  // Lower = more liquid
    amt: number,
};

export type FundData = {
    id: number,
    name: string,
    iCom: number,  // Investors' commitments
    iCal: 1000,  // Investors' money already called
    fCom: 2000,  // Fund's commitments
    fCal: 1250,  // Funds' money already called
    assets: AssetData[]
};
