// @flow

import {cross, range, transpose} from 'd3-array';

import type {Data, DataConfig, DataInfo, NameData} from '../Types';

export default function generateDataInfo(
    data: Data,
    nameData: NameData,
    dataConfig: DataConfig,
): DataInfo {
    // Note: It's important for data and nameData to have the same
    // ordering. This is because we currently use array indices
    // as data keys.

    // ***** Set up ***** //

    const dataTypes = ['normal', 'transpose', 'net', 'gross'];

    const ids = range(0, data.length, 1);  // ids ensured to be numbers

    // ['A.A', 'A.B', ...]
    const pairsAll2D = Array.from(new Set(
        cross(ids, ids, (idA, idB) => `${idA}.${idB}`),
    ));

    // ['A.B', 'A.C', ...]
    const pairsNoSelf2D = pairsAll2D.filter((pair) => {
        const [idA, idB] = pair.split('.');
        return idA !== idB
    });

    // ['A.A', 'A.B', ...] but won't register both 'A.B' and 'B.A' (only 'A.B')
    const pairsAll1DSet = new Set();
    ids.forEach((idA) => {
        ids.forEach((idB) => {
            const id1 = idA <= idB ? idA : idB;
            const id2 = id1 === idA ? idB : idA;
            pairsAll1DSet.add(`${id1}.${id2}`);
        });
    });
    const pairsAll1D = Array.from(pairsAll1DSet);

    // ['A.B', 'A.C'...] but won't register both 'A.B' and 'B.A' (only 'A.B')
    const pairsNoSelf1DSet = new Set();
    ids.forEach((idA) => {
        ids.forEach((idB) => {
            const id1 = idA <= idB ? idA : idB;
            const id2 = id1 === idA ? idB : idA;
            pairsNoSelf1DSet.add(`${id1}.${id2}`);
        });
    });
    const pairsNoSelf1D = Array.from(pairsNoSelf1DSet);

    const dataT = transpose(data);  // Transposed
    const dataN = data.map((r, rI) => (
        r.map((c, cI) => -data[rI][cI] + dataT[rI][cI])
    ));  // Net
    const dataG = data.map((r, rI) => (
        r.map((c, cI) => data[rI][cI] + dataT[rI][cI])
    ));  // Gross

    const dataMapper = {
        normal: data,
        transpose: dataT,
        net: dataN,
        gross: dataG,
    };

    const pairsMapper = {
        normal: {
            all: pairsAll2D,
            noSelf: pairsNoSelf2D,
        },
        transpose: {
            all: pairsAll2D,
            noSelf: pairsNoSelf2D,
        },
        net: {
            all: pairsAll1D,
            noSelf: pairsNoSelf1D,
        },
        gross: {
            all: pairsAll1D,
            noSelf: pairsNoSelf1D,
        },
    };

    const dataTotals = {};
    dataTypes.forEach((k) => {
        dataTotals[k] = dataMapper[k].map(r => r.reduce((t, v) => t + v, 0));
    });

    // ***** Rankings ***** //

    const ranks = {
        all: {},  // For totals
        pairs: {},  // For pairs
    };

    dataTypes.forEach((k) => {
        ranks.all[k] = [...ids];
        ranks.all[k].sort((idA, idB) => (
            dataTotals[k][idB] - dataTotals[k][idA]
        ));  // Array of ids sorted descending

        ranks.pairs[k] = {};

        ranks.pairs[k].all = [...pairsMapper[k].all]
            .filter((pair) => {
                const [idA, idB] = pair.split('.');
                return dataMapper[k][idA][idB] !== 0
                    && dataMapper[k][idB][idA] !== 0
            });
        ranks.pairs[k].all.sort((pairA, pairB) => {
            const [idA1, idA2] = pairA.split('.');
            const [idB1, idB2] = pairB.split('.');
            return dataMapper[k][idB1][idB2] - dataMapper[k][idA1][idA2]
        });  // Array of all pairs sorted descending

        ranks.pairs[k].noSelf = [...pairsMapper[k].noSelf]
            .filter((pair) => {
                const [idA, idB] = pair.split('.');
                return dataMapper[k][idA][idB] !== 0
                    && dataMapper[k][idB][idA] !== 0
            });
        ranks.pairs[k].noSelf.sort((pairA, pairB) => {
            const [idA1, idA2] = pairA.split('.');
            const [idB1, idB2] = pairB.split('.');
            return dataMapper[k][idB1][idB2] - dataMapper[k][idA1][idA2]
        });  // Array of pairs (no self e.g. 'A.A') sorted descending
    });


    // ***** Entities ***** //

    const entities = {};

    ids.forEach((id) => {
        entities[id] = {
            id,
            name: nameData[id],
            totals: {},
            ranks: {
                all: {},
                pairs: {},
            },
        };

        // Totals
        dataTypes.forEach((k) => {
            entities[id].totals[k] = dataTotals[k][id];
        });

        // Ranks all
        dataTypes.forEach((k) => {
            entities[id].ranks.all[k] = ranks.all[k].indexOf(id);
        });

        // Ranks pairs
        dataTypes.forEach((k) => {
            entities[id].ranks.pairs[k] = {};

            const ePairsAll = Array.from(new Set(
                cross([id], ids, (idSelf, idOther) => (
                    `${idSelf}.${idOther}`
                )),
            ));
            const ePairsNoSelf = ePairsAll.filter((pair) => {
                const [idA, idB] = pair.split('.');
                return idA !== idB
            });

            ePairsAll.sort((pairA, pairB) => {
                const [idA1, idA2] = pairA.split('.');
                const [idB1, idB2] = pairB.split('.');
                return dataMapper[k][idB1][idB2] - dataMapper[k][idA1][idA2]
            });
            ePairsNoSelf.sort((pairA, pairB) => {
                const [idA1, idA2] = pairA.split('.');
                const [idB1, idB2] = pairB.split('.');
                return dataMapper[k][idB1][idB2] - dataMapper[k][idA1][idA2]
            });

            entities[id].ranks.pairs[k].all = ePairsAll;
            entities[id].ranks.pairs[k].noSelf = ePairsNoSelf;
        });
    });

    // ***** Misc ***** //

    const totalGroup = {};
    dataTypes.forEach((k) => {
        totalGroup[k] = dataTotals[k].reduce((t, v) => t + v, 0);
    });

    // ***** End ***** //

    return {
        dataExtended: dataMapper,

        ranks,
        entities,

        totalGroup,
    }
}
