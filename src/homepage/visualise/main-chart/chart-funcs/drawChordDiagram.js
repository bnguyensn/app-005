// @flow

import {select} from 'd3-selection';
import {chord} from 'd3-chord';
import {rgb} from 'd3-color';
import {descending} from 'd3-array';
import {transition} from 'd3-transition';
import {interpolate} from 'd3-interpolate';

import createTicks from './createTicks';
import {EN_UK} from './createFormats';

import type {NameData} from '../../data/Types';
import type {ArcChartSize} from '../../chartSizes';
import type {D3EventAction} from './helpers';
import type {ColorScale} from './createColorScale';
import type {Chord, ChordData, ChordGroup} from './createChordData';

/** ********** TYPES ********** **/

export type RingsSelector = number[] | 'ALL';

export type RibbonsSelector = string[] | 'ALL';  // ['sourceI.targetI', ...][]

/** ********** SELECTIONS ********** **/

export function selectChordRings(
    parent: any,
    ringsSelector: RingsSelector,
): ?any {
    const chordRingsAll = parent.selectAll('.chord-ring');

    if (ringsSelector === 'ALL') {
        return chordRingsAll
            .selectAll('path');
    }

    if (Array.isArray(ringsSelector) && ringsSelector.length > 0) {
        return chordRingsAll.filter((d: any, i: number, nodes: any) => (
            ringsSelector.includes(d.index)
        ))
            .selectAll('path');
    }

    return null
}

export function selectChordRibbons(
    parent: any,
    ribbonsSelector: RibbonsSelector,
): ?any {
    const chordRibbonsAll = parent.selectAll('.chord-ribbon');

    if (ribbonsSelector === 'ALL') {
        return chordRibbonsAll;
    }

    if (Array.isArray(ribbonsSelector) && ribbonsSelector.length > 0) {
        return chordRibbonsAll
            .filter((d: any, i: number, nodes: any) => {
                const curST = `${d.source.index}.${d.target.index}`;
                const curTS = `${d.target.index}.${d.source.index}`;

                return ribbonsSelector.includes(curST)
                    || ribbonsSelector.includes(curTS)
            });
    }

    return null
}

/** ********** CHORD RINGS ********** **/

export function drawChordTicks(
    parent: any,
    nameData: NameData,
    size: ArcChartSize,
    step: number,
    formatSpecifier: string,
) {
    // ********** JOIN DATA ********** //

    // ***** Update ***** //

    const chordTickU = parent.selectAll('.chord-tick')
        .data(d => createTicks(d, step));

    // ***** Exit ***** //

    const chordTickX = chordTickU.exit();

    // ***** Enter ***** //

    const chordTickE = chordTickU.enter();

    // ***** Update & Enter ***** //

    const chordTickUE = chordTickE.append('g')
        .merge(chordTickU);

    // ********** DO SOMETHING WITH DATA ********** //

    // Create ticks

    chordTickUE.attr('transform', d => (
        `rotate(${d.angle * 180 / Math.PI - 90})
        translate(${size.outerRadius}, 0)`
    ));

    chordTickUE.append('line')
        .attr('class', 'chord-tick-line')
        .attr('stroke', '#212121')
        .attr('x1', 1)
        .attr('y1', 0)
        .attr('x2', 6)
        .attr('y2', 0);

    chordTickUE.filter(d => d.value % (5 * step) === 0)
        .append('text')
        .attr('class', 'chord-tick-label')
        .attr('x', 8)
        .attr('dy', '.35em')
        .attr('transform', d => d.angle > Math.PI
            ? 'rotate(180) translate(-16)'
            : null)
        .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
        .text(d => EN_UK.format(formatSpecifier)(d.value / 100));
}

function drawChordRings(
    parent: any,
    chordGroups: ChordGroup[],
    nameData: NameData,
    colorScale: ColorScale,
    size: ArcChartSize,
    eventActions?: D3EventAction[],
): any {
    // ********** JOIN DATA ********** //

    // ***** Update ***** //

    const chordRingsU = parent.selectAll('.chord-ring')
        .data(chordGroups);

    // ***** Exit ***** //

    const chordRingsX = chordRingsU.exit()
        .remove();

    // ***** Enter ***** //

    const chordRingsE = chordRingsU.enter()
        .append('g')
        .attr('class', 'chord-ring')
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

    // Create arc path

    chordRingsE.append('path')
        .attr('class', 'chord-ring-path')
        // .attr('fill-opacity', 1)
        // .attr('stroke-opacity', 1)
        .attr('transform', '');

    // Create label

    chordRingsE.append('g')
        .attr('class', 'chord-ring-label')
        .append('text')
        .attr('class', 'chord-ring-label-text');

    // ***** Update & Enter ***** //

    const chordRingsUE = chordRingsE
        .merge(chordRingsU);

    // Add events

    if (eventActions) {
        eventActions.forEach((eA) => {
            chordRingsUE.on(eA.event, eA.action);
            chordRingsX.on(eA.event, eA.action);
        });
    }

    // Update labels --- Moved to './updateChordDiagram'

    // Update arc ds --- Moved to './updateChordDiagram'

    // Colorise --- Moved to './updateChordDiagram'

    return chordRingsUE
}

/** ********** CHORD RIBBONS ********** **/

export function drawChordRibbons(
    parent: any,
    chords: Chord[],
    nameData: NameData,
    colorScale: ColorScale,
    size: ArcChartSize,
    eventActions?: D3EventAction[],
) {
    // ********** JOIN DATA ********** //

    // ***** Update ***** //

    const chordRibbonsU = parent.selectAll('.chord-ribbon')
        .data(chords);

    // ***** Exit ***** //

    const chordRibbonsX = chordRibbonsU.exit();

    // ***** Enter ***** //

    const chordRibbonsE = chordRibbonsU.enter()
        .append('path')
        .attr('class', 'chord-ribbon')
        .attr('id', d => (`ribbon-id-${d.source.index}-${d.target.index}`))
        .attr('fill-opacity', 0.75)
        .attr('stroke-opacity', 0.75)
        .attr('transform', '');

    // ***** Update & Enter ***** //

    const chordRibbonsUE = chordRibbonsE
        .merge(chordRibbonsU);

    // Add events

    if (eventActions) {
        eventActions.forEach((eA) => {
            chordRibbonsUE.on(eA.event, eA.action);
            chordRibbonsX.on(eA.event, eA.action);
        });
    }

    // Update ribbon ds --- Moved to './updateChordDiagram'

    // Colorise --- Moved to './updateChordDiagram'

    return chordRibbonsUE
}

/** ********** CHORDS ********** **/

export function drawChordDiagram(
    parent: any,
    chordData: ChordData,
    nameData: NameData,
    colorScale: ColorScale,
    size: ArcChartSize,
    clearAll: boolean,
    eventActions?: D3EventAction[],
): {chordRings: any, chordRibbons: any} {
    // ***** Set up chord data ***** //

    const {chords, chordGroups} = chordData;

    // ***** 1. Draw chord rings ***** //

    let chordRingsParent;
    if (clearAll) {
        chordRingsParent = parent.append('g')
            .attr('id', 'chord-rings');
    } else {
        chordRingsParent = parent.select('#chord-rings');
    }

    const chordRings = drawChordRings(
        chordRingsParent,
        chordGroups,
        nameData,
        colorScale, size, eventActions,
    );

    // ***** 2. Draw chord ribbons ***** //

    let chordRibbonsParent;
    if (clearAll) {
        chordRibbonsParent = parent.append('g')
            .attr('id', 'chord-ribbons');
    } else {
        chordRibbonsParent = parent.select('#chord-ribbons');
    }

    const chordRibbons = drawChordRibbons(
        chordRibbonsParent,
        chords,
        nameData,
        colorScale, size, eventActions,
    );

    // ***** ?. Draw chord ticks ***** //

    /*const chordTicksParent = chordRings.append('g')
        .attr('class', 'chord-ticks')
        .attr('id', d => `ticks-id-${d.index}`);
    drawChordTicks(chordTicksParent, nameData, size, 1, '.2%');*/

    // ***** Return selections ***** //

    return {chordRings, chordRibbons}
}
