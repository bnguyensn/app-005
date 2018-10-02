// @flow

import objHasKey from './objHasKey';

import type {FundData} from '../../components/DataTypes';

export function filterData(
    data: FundData[],
    mutatedData: FundData[],
    min: number,
    max: number,
    forceUpdate?: boolean = false,
): FundData[] | null {
    const dataCount = data.length;

    const nextMutatedData = data.filter((d, i) => (
        (i + 1) >= Math.ceil(min * dataCount)
        && (i + 1) <= Math.ceil(max * dataCount)
    ));

    if (mutatedData.length !== nextMutatedData.length || forceUpdate) {
        return nextMutatedData
    }

    return null
}

export function sortData(
    data: FundData[],
    sortKey: string,
): FundData[] | null {
    // Create a dummy fund data for certain checks within this function

    const sampleFundData = data[0];

    // Only sort if sort values exist

    if (objHasKey(sampleFundData, sortKey)) {
        // Array.prototype.sort() mutates, so let's copy the original data

        const sortedData = [...data];

        // Sort data depending on whether sort values are strings or numbers
        // No sort performed if sort value type is not supported

        if (typeof sampleFundData[sortKey] === 'string') {
            // Sort values are strings

            console.log('sorting strings!');

            return sortedData.sort((fundDataA, fundDataB) => {
                const casedA = fundDataA[sortKey].toUpperCase();
                const casedB = fundDataB[sortKey].toUpperCase();

                if (casedA < casedB) return -1;
                if (casedA > casedB) return 1;
                return 0
            })
        }

        if (typeof sampleFundData[sortKey] === 'number'
            && !Number.isNaN(sampleFundData[sortKey])) {
            // Sort values are numbers

            console.log('sorting numbers!');

            return sortedData.sort((fundDataA, fundDataB) => (
                fundDataA[sortKey] - fundDataB[sortKey]
            ))
        }

        return null
    }

    return null
}
