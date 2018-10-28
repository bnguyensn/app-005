// @flow


import {selectRibbons, selectRings} from '../main-chart/chart-funcs/selections';
import {
    updateHighlight,
    updateRibbonsColor, updateRibbonsProperties, updateRingsColor,
    updateRingsLabels, updateRingsProperties,
}
    from '../main-chart/chart-funcs/updateChordDiagram';

import type {ColorScale, Data, NameData, Updates} from '../data/Types';
import type {ChordData} from '../main-chart/chart-funcs/createChordData';
import type {ArcChartSize} from '../chartSizes';
import type {RibbonsSelector, RingsSelector}
    from '../main-chart/chart-funcs/selections';

export function createUpdatesNewData(
    data: Data,
    prevData: Data,
    chordData: ChordData,
    prevChordData: ?ChordData,
    nameData: NameData,
    colorScale: ColorScale,
    size: ArcChartSize,
): Updates {
    const selectFns = [
        selectRings,
        selectRibbons,
        selectRings,
        selectRings,
        selectRibbons,
    ];

    const selectors = [
        'ALL',
        'ALL',
        'ALL',
        'ALL',
        'ALL',
    ];

    const updateFns = [
        updateRingsProperties,
        updateRibbonsProperties,
        updateRingsLabels,
        updateRingsColor,
        updateRibbonsColor,
    ];

    const updateFnParams = [
        [prevChordData
            ? prevChordData.chordGroups
            : null, size],
        [prevChordData
            ? prevChordData.chords
            : null, size],
        [nameData, size],
        [colorScale],
        [colorScale],
    ];

    return {selectFns, selectors, updateFns, updateFnParams}
}

export function createUpdatesNormalHighlight(): Updates {
    const selectFns = [
        selectRings,
        selectRibbons,
    ];

    const selectors = [
        'ALL',
        'ALL',
    ];

    const updateFns = [
        updateHighlight,
        updateHighlight,
    ];

    const updateFnParams = [
        [1],
        [0.75],
    ];

    return {selectFns, selectors, updateFns, updateFnParams}
}

export function createUpdatesHighlight(
    ringsSelectors: RingsSelector,
    ribbonsSelectors: RibbonsSelector,
    ringsEndOp: number,
    ribbonsEndOp: number,
): Updates {
    const selectFns = [
        selectRings,
        selectRibbons,
        selectRings,
        selectRibbons,
    ];

    const selectors = [
        'ALL',
        'ALL',
        ringsSelectors,
        ribbonsSelectors,
    ];

    const updateFns = [
        updateHighlight,
        updateHighlight,
        updateHighlight,
        updateHighlight,
    ];

    const updateFnParams = [
        [0.02],
        [0.02],
        [ringsEndOp],
        [ribbonsEndOp],
    ];

    return {selectFns, selectors, updateFns, updateFnParams}
}
