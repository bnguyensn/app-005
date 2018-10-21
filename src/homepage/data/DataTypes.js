// @flow

import Data from './Data';

export type ColorData = string[];

export type NameData = string[];

export type Data = (number[])[];

export type DataConfig = {
    outflow: boolean,  // true: rows = outflows / false: rows = inflows
    label: string,  // e.g. exports / imports
    amtPrefix: string,  // e.g. £, $, etc.
    amtSuffix: string,  // e.g. m, bn, etc.
    amtRounding: number,
};

// ***** DATA INFO ***** //

type RowPartner = {index: number, value: number};
type SortItem = {index: number, value: number};
type Row = {
    index: number,

    total: number,  // "Normal" total
    totalT: number,  // Transposed total
    totalN: number,  // Net total
    totalG: number,  // Gross total

    // Copies of data / dataT / dataN / dataG
    row: number[],
    rowT: number[],
    rowN: number[],
    rowG: number[]
}
export type DataInfoRowSorts = {[key: string]: SortItem[]};
export type DataInfoItemSorts = {[key: string]: {[key: string]: SortItem[]}}
export type DataInfoRows = Row[];

type Entity = {
    rowSorts: {[key: string]: number},  // rowSorts ranking

    partners: RowPartner[],
    TPartners: RowPartner[],
    netPartners: RowPartner[],
    grossPartners: RowPartner[],
}

type Pair = {
    name: string,  // Always 'higherIndex.lowerIndex'
    indexH: number,
    indexL: number,
    valueHL: number,
};
export type Pairs = {
    all: Pair[],
    unique: Pair[],
};
export type DataInfoPairs = {
    normal: Pairs,
    transpose: Pairs,
    net: Pairs,
    gross: Pairs,
};

export type DataInfo = {
    dataT: Data,
    dataN: Data,
    dataG: Data,

    entities: {[key: string]: Entity},

    rows: DataInfoRows,
    rowSorts: DataInfoRowSorts,
    rowItemSorts: DataInfoItemSorts,

    pairs: DataInfoPairs,

    totalGroup: number,
};
