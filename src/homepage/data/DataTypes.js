// @flow

export type ColorData = string[];

export type NameData = string[];

export type Data = (number[])[];

export type DataType = 'normal' | 'transpose' | 'net' | 'gross';

export type DataConfig = {
    dataType: DataType,
    pairsNoSelf: boolean,
};

export type DisplayConfig = {
    dataTypeLabels: {[key: DataType]: string},  // e.g. 'normal' = 'exports'
    entityLabel: string,  // e.g. country
    transactionLabel: string,  // e.g. exports / imports
    amtPrefix: string,  // e.g. £, $, etc.
    amtSuffix: string,  // e.g. m, bn, etc.
    amtRounding: number,
};

// ********** DATA INFO ********** //

// ***** Data ***** //

export type DataInfoData = {[key: DataType]: Data};

// ***** Ranks ***** //

export type RanksAll = {[key: DataType]: number[]};

export type RanksPairs = {
    [key: DataType]: {
        all: string[],
        noSelf: string[],
    }
};

export type DataInfoRanks = {
    all: RanksAll,
    pairs: RanksPairs,
};

// ***** Entities ***** //

export type EntityTotals = {[key: DataType]: number};

export type EntityRanksAll = {[key: DataType]: number};

export type EntityRanksPair = {
    [key: DataType]: {
        all: string[],
        noSelf: string[],
    }
};

export type Entity = {
    id: number,
    name: string,
    totals: EntityTotals,
    ranks: {
        all: EntityRanksAll,
        pairs: EntityRanksPair,
    }
};

export type DataInfoEntities = {[key: string]: Entity};

// ***** Total group ***** //

export type DataInfoTotalGroup = {[key: DataType]: number};

// ***** End ***** //

export type DataInfo = {
    dataExtended: DataInfoData,

    ranks: DataInfoRanks,
    entities: DataInfoEntities,

    totalGroup: DataInfoTotalGroup,
};
