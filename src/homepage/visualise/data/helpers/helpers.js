// @flow

import {max, min} from 'd3-array';
import type {Data, DataConfig, DataInfo, DataInfoEntities, DataType} from '../Types';
import type {ChordData, ChordGroup} from '../../main-chart/chart-funcs/createChordData';

export function maxIndex(arr: any[]) {
    return arr.reduce((acc, curVal, index) => {
        if (curVal > acc.value) {
            acc.value = curVal;
            acc.index = index;
            return acc
        }

        return acc
    }, {value: 0, index: 0});
}

export function minIndex(arr: any[]) {
    return arr.reduce((acc, curVal, index) => {
        if (curVal < acc.value) {
            acc.value = curVal;
            acc.index = index;
            return acc
        }

        return acc
    }, {value: Infinity, index: 0});
}

export function getRingsRibbonsFromRing(
    chordData: ChordData,
    ringIndex: number,
) {
    const ringsG = [ringIndex];

    const ribbonsG = chordData.chords.reduce((acc, c, i) => {
        if (c.source.index === ringIndex) {
            ringsG.push(c.target.index);
            acc.push(`${c.source.index}.${c.target.index}`);
        }

        if (c.target.index === ringIndex) {
            ringsG.push(c.source.index);
            acc.push(`${c.source.index}.${c.target.index}`);
        }

        return acc
    }, []);

    return [ringsG, ribbonsG]
}

export function getRingsRibbonsFromRibbon(
    chordData: ChordData,
    ribbonSIndex: number,
    ribbonTIndex: number,
) {
    const ringsG = [Number(ribbonSIndex), Number(ribbonTIndex)];
    const ribbonsG = [`${ribbonSIndex}.${ribbonTIndex}`];

    return [ringsG, ribbonsG]
}

/** ********** GETTING DATA INFORMATION ********** **/

export function getEntityIdFromRankAll(
    dataInfo: DataInfo,
    rank: number | 'LAST',
    rankType: DataType,
): number {
    const a = dataInfo.ranks.all[rankType];

    if (rank === 'LAST') {
        const last = a.length - 1;
        return a[last]
    }

    return a[rank]
}

export function getEntityPartnerIdFromPartnerRank(
    dataInfo: DataInfo,
    entityId: number,
    rank: number | 'LAST',
    rankType: DataType,
    noSelf: boolean,
) {
    const ns = noSelf ? 'noSelf' : 'all';
    const a = dataInfo.entities[entityId].ranks.pairs[rankType][ns];

    let pName;

    if (rank === 'LAST') {
        const last = a.length - 1;
        pName = a[last]
    } else {
        pName = a[rank];
    }

    const [idA, idB] = pName.split('.');

    return Number(idA) === entityId ? idB : idA;
}

export function getPairNameFromRankPairs(
    dataInfo: DataInfo,
    rankPairs: number | 'LAST',
    rankPairsType: DataType,
    noSelf: boolean,
): string {
    const ns = noSelf ? 'noSelf' : 'all';
    const a = dataInfo.ranks.pairs[rankPairsType][ns];

    if (rankPairs === 'LAST') {
        const last = a.length - 1;
        return a[last]
    }

    return a[rankPairs]
}

export function getPairIdsFromPairName(pairName: string) {
    return pairName.split('.')
}

export function getPair1DNameFromPairName(pairName: string) {
    const [idA, idB] = getPairIdsFromPairName(pairName);
    const id1 = idA <= idB ? idA : idB;
    const id2 = id1 === idA ? idB : idA;
    return `${id1}.${id2}`
}

export function getPairRankingWithinEntity(
    entities: DataInfoEntities,
    dataConfig: DataConfig,
    pairName: string,
    entityId: string,
) {
    const {dataType, pairsNoSelf} = dataConfig;
    const ns = pairsNoSelf ? 'noSelf' : 'all';

    const arr = entities[entityId].ranks.pairs[dataType][ns];
    const pairNameR = pairName.split('.').reverse().join('.');

    const r = arr.indexOf(pairName);
    const rR = arr.indexOf(pairNameR);

    if (r > -1) return r;

    if (rR > -1) return rR;

    return -1
}
