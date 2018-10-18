// @flow

import {chord} from 'd3-chord';
import {rgb} from 'd3-color';
import {descending} from 'd3-array';
import {transition} from 'd3-transition';

import createArc from './createArc';
import createRibbon from './createRibbon';
import createTicks from './createTicks';
import {EN_UK} from './createFormats';

import type {Data, NameData} from '../../../data/DataTypes';
import type {ArcChartSize} from '../../chartSizes';
import type {D3EventAction, D3SelectionEventHandler} from './d3Types';
import type {ColorScale} from './createColorScale';
import type {ActiveRibbons, ActiveRings} from '../../stages/createStage';

/** ********** CONFIGS ********** **/

const RING_OPACITY_ACT = 0.75;
const RING_OPACITY_PAS = 0.1;
const RIBBON_OPACITY_ACT = 0.66;
const RIBBON_OPACITY_PAS = 0.1;
const TRANSITION_DUR = 500;

/** ********** DATA TYPES ********** **/

export type ChordRingData = {
    startAngle: number,
    endAngle: number,
    value: number,
    index: number,
};

type ChordRibbonSTData = {
    startAngle: number,
    endAngle: number,
    value: number,
    index: number,
    subIndex: number,
};

export type ChordRibbonData = {
    source: ChordRibbonSTData,
    target: ChordRibbonSTData,
};

export type Stagger = number | (d: any, i: number, nodes: any) => number

/** ********** STYLINGS ********** **/

function changeOpacity(
    s: any,
    targetOpacity: number,
    stagger: Stagger,
    d: number,
) {
    s.transition()
        .duration(d)
        .delay(stagger)
        .attr('stroke-opacity', targetOpacity)
        .attr('fill-opacity', targetOpacity);
}

export function highlightChordRings(
    parent: any,
    activeRings: ActiveRings,
    stagger?: Stagger = 0,
    activeOpacity?: number = RING_OPACITY_ACT,
    passiveOpacity?: number = RING_OPACITY_PAS,
    d?: number = TRANSITION_DUR,
) {
    // ***** Selection ***** //

    const chordRings = parent.selectAll('.chord-ring');
    let activeRingsS, passiveRingsS;

    if (activeRings === 'ALL') {
        activeRingsS = chordRings;
        passiveRingsS = null;
    } else if (Array.isArray(activeRings) && activeRings.length > 0) {
        activeRingsS = chordRings.filter((d: any, i: number, nodes: any) => (
            activeRings.includes(d.index)
        ));
        passiveRingsS = chordRings.filter((d: any, i: number, nodes: any) => (
            !activeRings.includes(d.index)
        ));
    } else {
        activeRingsS = null;
        passiveRingsS = chordRings;
    }

    // ***** Perform the highlight operation ***** //

    if (activeRingsS) {
        changeOpacity(activeRingsS, activeOpacity, stagger, d);
    }
    if (passiveRingsS) {
        changeOpacity(passiveRingsS, passiveOpacity, stagger, d);
    }
}

export function highlightChordRibbons(
    parent: any,
    activeRibbons: ActiveRibbons,
    stagger?: Stagger = 0,
    activeOpacity?: number = RIBBON_OPACITY_ACT,
    passiveOpacity?: number = RIBBON_OPACITY_PAS,
    dur?: number = TRANSITION_DUR,
) {
    // ***** Selection ***** //

    const chordRibbons = parent.selectAll('.chord-ribbon');
    let activeRibbonsS, passiveRibbonsS;

    if (activeRibbons === 'ALL') {
        activeRibbonsS = chordRibbons;
        passiveRibbonsS = null;
    } else if (Array.isArray(activeRibbons) && activeRibbons.length > 0) {
        // ***** Comparison preparation ***** //
        // Convert activeRibbons to an array of sourceIndex.targetIndex,
        // for ease of comparison when doing the .selectAll()

        const activeRibbonsST = activeRibbons
            .map(ribbon => `${ribbon[0]}.${ribbon[1]}`);

        activeRibbonsS = chordRibbons
            .filter((d: any, i: number, nodes: any) => {
                const curST = `${d.source.index}.${d.target.index}`;

                return activeRibbonsST.includes(curST)
            });
        passiveRibbonsS = chordRibbons
            .filter((d: any, i: number, nodes: any) => {
                const curST = `${d.source.index}.${d.target.index}`;

                return !activeRibbonsST.includes(curST)
            });
    } else {
        activeRibbonsS = null;
        passiveRibbonsS = chordRibbons;
    }

    // ***** Perform the highlight operation ***** //

    if (activeRibbonsS) {
        changeOpacity(activeRibbonsS, activeOpacity, stagger, dur)
    }
    if (passiveRibbonsS) {
        changeOpacity(passiveRibbonsS, passiveOpacity, stagger, dur)
    }
}

/** ********** CHORD RINGS ********** **/

export function coloriseChordRings(chordGroups: any, colorScale: ColorScale) {
    chordGroups.attr('fill', d => colorScale(d.index))
        .attr('stroke', d => rgb(colorScale(d.index)).darker())
}

export function drawChordRings(
    parent: any,
    chordGroups: any,
    nameData: NameData,
    colorScale: ColorScale,
    size: ArcChartSize,
    eventActions?: D3EventAction[],
) {
    // ********** JOIN DATA ********** //

    // ***** Update ***** //

    const chordRingsU = parent.selectAll('.chord-ring')
        .data(chordGroups);

    // ***** Exit ***** //

    const chordRingsX = chordRingsU.exit();

    // ***** Enter ***** //

    const chordRingsE = chordRingsU.enter();

    // ***** Update & Enter ***** //

    const chordRingsUE = chordRingsE.append('g')
        .attr('class', 'chord-ring')
        .attr('id', d => `ring-id-${d.index}`)
        .merge(chordRingsU);

    // ********** DO SOMETHING WITH DATA ********** //

    // Create and colorise donut rings

    chordRingsUE.attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

    const a = createArc(size);

    chordRingsUE.append('path')
        .attr('d', a);

    coloriseChordRings(chordRingsUE, colorScale);

    // Add events

    if (eventActions) {
        eventActions.forEach((eA) => {
            chordRingsUE.on(eA.event, eA.action);
            chordRingsX.on(eA.event, eA.action);
        });
    }

    return chordRingsUE
}

/** ********** CHORD RIBBONS ********** **/

export function coloriseChordRibbons(chordRibbons: any, colorScale: ColorScale) {
    chordRibbons
        .attr('fill', d => colorScale(d.source.index))
        .attr('stroke', d => rgb(colorScale(d.source.index)).darker());
}

export function drawChordRibbons(
    parent: any,
    chords: any,
    nameData: NameData,
    colorData: ColorScale,
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

    const chordRibbonsE = chordRibbonsU.enter();

    // ***** Update & Enter ***** //

    const chordRibbonsUE = chordRibbonsE.append('path')
        .attr('class', 'chord-ribbon')
        .attr('id', d => (`ribbon-id-${d.source.index}-${d.target.index}`))
        .merge(chordRibbonsU);

    // ********** DO SOMETHING WITH DATA ********** //

    // Create and colorise ribbons

    const r = createRibbon(size);

    chordRibbonsUE.attr('d', r)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

    coloriseChordRibbons(chordRibbonsUE, colorData);

    // Add events

    if (eventActions) {
        eventActions.forEach((eA) => {
            chordRibbonsUE.on(eA.event, eA.action);
            chordRibbonsX.on(eA.event, eA.action);
        });
    }

    return chordRibbonsUE
}

/** ********** CHORD TICKS ********** **/

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

/** ********** CHORD LABELS ********** **/

export function drawChordLabels(
    parent: any,
    nameData: NameData,
    size: ArcChartSize,
) {
    parent.append('text')
        .each((d) => {
            d.angle = (d.startAngle + d.endAngle) / 2
        })  // Modifies d
        .attr('dy', '.35em')
        .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
        .attr('transform', d => (
            `rotate(${d.angle * 180 / Math.PI - 90})
            translate(${size.innerRadius + 80})
            ${d.angle > Math.PI ? 'rotate(180)' : ''}`
        ))
        .text((d, i) => nameData[i]);
}

/** ********** CHORDS ********** **/

export function drawChordDiagram(
    parent: any,
    data: Data,
    nameData: NameData,
    colorScale: ColorScale,
    size: ArcChartSize,
    eventActions?: D3EventAction[],
) {
    const chordGenerator = chord()
        .padAngle(0.05)
        .sortSubgroups(descending)
        .sortChords(descending);

    const chords = chordGenerator(data);

    const chordRingsParent = parent.append('g')
        .attr('id', 'chord-rings');
    const chordRings = drawChordRings(chordRingsParent, chords.groups, nameData,
        colorScale, size, eventActions);

    const chordRibbonsParent = parent.append('g')
        .attr('id', 'chord-ribbons');
    const chordRibbons = drawChordRibbons(chordRibbonsParent, chords, nameData,
        colorScale, size, eventActions);

    const chordTicksParent = chordRings.append('g')
        .attr('class', 'chord-ticks')
        .attr('id', d => `ticks-id-${d.index}`);
    drawChordTicks(chordTicksParent, nameData, size, 1, '.2%');

    const chordLabelsParent = chordRings.append('g')
        .attr('class', 'chord-label')
        .attr('id', d => `label-id-${d.index}`);
    drawChordLabels(chordLabelsParent, nameData, size);

    return {chordRings, chordRibbons}
}
