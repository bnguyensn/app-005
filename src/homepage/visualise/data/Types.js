// @flow

// ********** DATA ********** //

import type {ChordData} from '../main-chart/chart-funcs/drawChordDiagram';
import type {RibbonsSelector, RingsSelector, SelectFn} from '../main-chart/chart-funcs/selections';
import type {Chord, ChordGroup} from '../main-chart/chart-funcs/createChordData';

export type ColorData = string[];

export type ColorScale = (any) => string;

export type NameData = string[];

export type Data = (number[])[];

export type DataType = 'normal' | 'transpose' | 'net' | 'gross';

// ********** DATA & DISPLAY CONFIGS ********** //

export type DataConfig = {
    dataType: DataType,
    pairsNoSelf: boolean,
    sheetsOrder: boolean,  // true = time moves from left to right
    curSheet: number,  // Switch between sheets via this
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

// A dataInfo object for each sheet
// {sheetNameA: DataInfo, ...}
export type DataAll = {
    [key: string]: {
        dataInfo: DataInfo,
        nameData: NameData,
    }
};

// ********** CHART DATA ********** //
// Data specific to charts
// Main intention is to store chord data for transition purposes

export type ChartData = {
    cur: ?ChordData,
    prev: ?ChordData,
};

// ********** ACTIVE ITEMS ********** //

export type ActiveItem = {
    type: 'RING' | 'RIBBON' | null,
    name: string | number,
    d: Chord | ChordGroup,
};

export type ActiveItems = {
    hovered: ?ActiveItem,
    clicked: ?ActiveItem,
};

// ********** UPDATES DATA ********** //

export type Updates = {
    selectFns: SelectFn[],
    selectors: (RingsSelector | RibbonsSelector)[],
    updateFns: ((any) => any)[],
    updateFnParams: any[],
};
