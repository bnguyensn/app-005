// @flow

export type FundData = {
    id: number,
    name: string,
    iCom: number,  // Investors' commitments
    iCal: 1000,  // Investors' money already called
    fCom: 2000,  // Fund's commitments
    fCal: 1250,  // Funds' money already called
    assetL1: {[key: string]: number},  // Level 1 assets
    assetL2: {[key: string]: number},  // Level 2 assets
    assetL3: {[key: string]: number},  // Level 3 assets
};
