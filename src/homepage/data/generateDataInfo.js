// @flow

import {transpose} from 'd3-array';

import type {Data, DataInfo, NameData} from './DataTypes';

export default function generateDataInfo(
    data: Data, nameData: NameData,
): DataInfo {
    // Note: It's important for data and nameData to have the same
    // ordering. This is because we currently use array indices
    // as data keys.

    // ***** Create extra matrices for data info purposes ***** //

    const dataT = transpose(data);  // Transposed
    const dataN = data.map((r, rI) => (  // Net
        r.map((c, cI) => -data[rI][cI] + dataT[rI][cI])
    ));
    const dataG = data.map((r, rI) => (  // Gross
        r.map((c, cI) => data[rI][cI] + dataT[rI][cI])
    ));

    // ***** Entities ***** //

    const entities = nameData.reduce((acc, curVal) => {
        acc[curVal] = {
            rowSorts: {},
        };
        return acc
    }, {});

    // ***** Rows ***** //

    const rows = data.map((r, rI) => {
        // Calculate totals
        const total = r.reduce((t, v) => t + v, 0);
        const totalT = dataT[rI].reduce((t, v) => t + v, 0);
        const totalN = -total + totalT;
        const totalG = total + totalT;

        return {
            index: rI,  // The original data index
            name: nameData[rI],

            // All the totals
            total,
            totalT,
            totalN,
            totalG,

            // All the actual rows
            row: [...r],
            rowT: [...dataT[rI]],
            rowN: [...dataN[rI]],
            rowG: [...dataG[rI]],
        }
    });

    // ***** Row / Item Sorts ***** //

    const rowSorts = {};
    const rowItemSorts = {};

    // Row sorts (descending)
    // To access: e.g. get largest total row id: rowSorts.total[0].index
    const rowSortsKeys = ['total', 'totalT', 'totalN', 'totalG'];
    rowSortsKeys.forEach((k) => {
        rowSorts[k] = rows
            .map(row => ({index: row.index, value: row[k]}))
            .sort((rA, rB) => rB.value - rA.value);
    });

    // Item sorts (descending)
    // To access: e.g. get rowT 3's largest item id:
    // rowItemSorts.rowT[3][0].index
    const rowItemSortKeys = ['row', 'rowT', 'rowN', 'rowG'];
    rowItemSortKeys.forEach((k) => {
        rowItemSorts[k] = {};
        rows.forEach((r, rI) => {
            rowItemSorts[k][rI] = r[k]
                .map((v, i) => ({index: i, value: v}))
                .filter(o => o.value !== 0)
                .sort((rA, rB) => rB.value - rA.value);
        });
    });

    // ***** ...back to entities ***** //

    // Update entities' rowSorts rankings
    rowSortsKeys.forEach((k) => {
        rowSorts[k].forEach((r, i) => {
            entities[nameData[r.index]].rowSorts[k] = i;
        });
    });

    // Update entities' partner indices
    // nameData order === row order

    // ***** Pairs ***** //

    const pairs = {};
    const dataStore = {
        normal: data,
        transpose: dataT,
        net: dataN,
        gross: dataG,
    };
    const allowSameST = true;  // Does A-A count?

    // Pairs allowing same ST:
    Object.keys(dataStore).forEach((k) => {
        pairs[k] = {
            all: [],
            unique: [],
        };
        for (let i = 0; i < dataStore[k].length; i++) {
            for (let j = i; j < dataStore[k][i].length; j++) {
                const indexH = dataStore.normal[i][j] >= dataStore.normal[j][i]
                    ? i : j;
                const indexL = indexH === i ? j : i;
                const name = `${indexH}.${indexL}`;

                const pair = {
                    name,
                    indexH,
                    indexL,
                    valueHL: dataStore[k][indexH][indexL]
                        + dataStore[k][indexL][indexH],
                };

                if (i !== j) {
                    pairs[k].unique.push(pair);
                }
                pairs[k].all.push(pair);
            }
        }

        // Sort pairs descending based on total values
        pairs[k].all.sort((pairA, pairB) => pairB.valueHL - pairA.valueHL);
        pairs[k].unique.sort((pairA, pairB) => pairB.valueHL - pairA.valueHL);
    });

    // Pairs without same ST:


    // ***** Misc ***** //

    const totalGroup = rows.reduce((acc, row) => row.total + acc, 0);

    // ***** End ***** //

    return {
        dataT,
        dataN,
        dataG,

        entities,

        rows,
        rowSorts,
        rowItemSorts,

        pairs,

        totalGroup,
    }
}
