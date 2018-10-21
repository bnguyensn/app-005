// @flow

import {max, min} from 'd3-array';
import type {Data, DataInfoPairs, DataInfoRows, DataInfoRowSorts, NameData, Pairs} from './DataTypes';
import {formatAmount} from '../visualise/analytics/helpers';

export function maxIndex(arr) {
    return arr.reduce((acc, curVal, index) => {
        if (curVal > acc.value) {
            acc.value = curVal;
            acc.index = index;
            return acc
        }

        return acc
    }, {value: 0, index: 0});
}

export function minIndex(arr) {
    return arr.reduce((acc, curVal, index) => {
        if (curVal < acc.value) {
            acc.value = curVal;
            acc.index = index;
            return acc
        }

        return acc
    }, {value: Infinity, index: 0});
}

export function getHGroupsFromRing(data: Data, ringIndex: number) {
    const ringsG = [ringIndex];
    const ribbonsG = data[ringIndex].reduce((acc, v, i) => {
        if (v !== 0) {
            ringsG.push(i);
            acc.push(`${ringIndex}.${i}`, `${i}.${ringIndex}`);
        }
        return acc
    }, []);

    return [ringsG, ribbonsG]
}

export function getHGroupsFromRibbon(
    data: Data,
    ribbonSIndex: number,
    ribbonTIndex: number,
) {
    const ringsG = [ribbonSIndex, ribbonTIndex];
    const ribbonsG = [`${ribbonSIndex}.${ribbonTIndex}`];

    return [ringsG, ribbonsG]
}

export function getEntityDataFromRowRank(
    nameData: NameData,
    colorScale: any,
    rows: DataInfoRows,
    rowSorts: DataInfoRowSorts,
    groupTotal: number,
    rowSortsKey: string,
    rowRank: number,
): {
    eI: number, eName: string, eAmt: number, eAmtP: number, eColor: string,
} {
    const eI = rowSorts[rowSortsKey][rowRank].index;
    const eAmt = rows[eI][rowSortsKey];

    return {
        eI,
        eName: nameData[eI],
        eAmt,
        eAmtP: eAmt / groupTotal,
        eColor: colorScale(eI),
    }
}

export function getPairDataFromPairRank(
    data: Data,
    nameData: NameData,
    colorScale: any,
    pairs: Pairs,
    groupTotal: number,
    pairRank: number,
) {
    const p = pairs[pairRank];

    const pHI = p.indexH;
    const pLI = p.indexL;

    return {
        pHI,
        pLI,
        pHName: nameData[pHI],
        pLName: nameData[pLI],
        pHColor: colorScale(pHI),
        pLColor: colorScale(pLI),
        pHAmt: data[pHI][pLI],
        pLAmt: data[pLI][pHI],
        pHLAmt: p.valueHL,
        pHLAmtP: p.valueHL / groupTotal,
    }
}
