// @flow

import type {CompanyData, GrowthData} from '../../data/Types';

/**
 * Current assumptions
 * - No abnormal assets (one-off)
 * */
function addOrRemoveYears(
    data: CompanyData[],
    growthData: GrowthData,
): CompanyData {
    const latestIndex = data.length - 1;

    const inflowNames = Object.keys(data[0].inflows);
    const outflowNames = Object.keys(data[0].outflows);

    let newTotalInflows = 0;
    let newTotalInflowsW = 0;
    let newTotalOutflows = 0;
    let newTotalOutflowsW = 0;

    const newInflows = inflowNames.reduce((acc, curVal) => {
        const curData = data[latestIndex].inflows[curVal];

        const growthRate = growthData[curVal]
            ? 1 + growthData[curVal]
            : 1.05;

        const newAmt = parseInt(curData.amt * growthRate, 10);
        const newAmtW = parseInt(curData.amtW * growthRate, 10);

        newTotalInflows += newAmt;
        newTotalInflowsW += newAmtW;

        acc[curVal] = {
            w: curData.w,
            amt: newAmt,
            amtW: newAmtW,
        };

        return acc
    }, {});
    const newOutflows = outflowNames.reduce((acc, curVal) => {
        const curData = data[latestIndex].outflows[curVal];

        const growthRate = growthData[curVal]
            ? 1 + growthData[curVal]
            : 1.05;

        const newAmt = parseInt(curData.amt * growthRate, 10);
        const newAmtW = parseInt(curData.amtW * growthRate, 10);

        newTotalOutflows += newAmt;
        newTotalOutflowsW += newAmtW;

        acc[curVal] = {
            w: curData.w,
            amt: newAmt,
            amtW: newAmtW,
        };

        return acc
    }, {});


    return {
        id: data[latestIndex].id + 1,
        year: data[latestIndex].year + 1,
        inflows: newInflows,
        outflows: newOutflows,
        totalInflows: newTotalInflows,
        totalInflowsW: newTotalInflowsW,
        totalOutflows: newTotalOutflows,
        totalOutflowsW: newTotalOutflowsW,
        headroom: newTotalInflows - newTotalOutflows,
        headroomW: newTotalInflowsW - newTotalOutflowsW,

        sortIndices: {},  // TODO:
    }
}

export function addNYears(
    data: CompanyData[],
    growthData: GrowthData,
    numberOfYears: number,
) {
    if (numberOfYears > 0) {
        const projectedData = [...data];

        for (let i = 0; i < numberOfYears; i++) {
            projectedData.push(addOrRemoveYears(projectedData, growthData));
        }

        return projectedData
    }

    return [...data]
}
