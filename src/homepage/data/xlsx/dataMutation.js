// @flow

import objHasKey from '../../lib/objHasKey';

import type {CompanyData} from '../DataTypes';

export function filterData(
    data: CompanyData[],
    mutatedData: CompanyData[],
    min: number,
    max: number,
    forceUpdate?: boolean = false,
): CompanyData[] | null {
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
    data: {[key: string]: any}[],
    sortKey: string,
    asc?: boolean = true,  // Ascending flag
): {[key: string]: any}[] | null {
    // Create a dummy fund data for certain checks within this function

    const sampleFundData = data[0];

    // Only sort if sort key exists

    if (objHasKey(sampleFundData, sortKey)) {
        // Array.prototype.sort() mutates, so let's copy the original data

        const sortedData = [...data];

        // Sort data depending on whether sort values are strings or numbers
        // No sort performed if sort value type is not supported

        if (typeof sampleFundData[sortKey] === 'string') {
            // Sort values are strings

            return sortedData.sort((fundDataA, fundDataB) => {
                const casedA = fundDataA[sortKey].toUpperCase();
                const casedB = fundDataB[sortKey].toUpperCase();

                if (asc) {
                    if (casedA < casedB) return -1;
                    if (casedA > casedB) return 1;
                } else {
                    if (casedA > casedB) return -1;
                    if (casedA < casedB) return 1;
                }

                return 0
            })
        }

        if (typeof sampleFundData[sortKey] === 'number'
            && !Number.isNaN(sampleFundData[sortKey])) {
            // Sort values are numbers

            return sortedData.sort((fundDataA, fundDataB) => (
                asc
                    ? fundDataA[sortKey] - fundDataB[sortKey]
                    : fundDataB[sortKey] - fundDataA[sortKey]
            ))
        }

        return null
    }

    return null
}
