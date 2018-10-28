// @flow

import {chord} from 'd3-chord';
import {descending} from 'd3-array';

import type {Data} from '../../data/Types';

/** ********** TYPES ********** **/

export type ChordST = {
    endAngle: number, index: number,
    startAngle: number, subindex: number,
    value: number
};

export type Chord = {source: ChordST, target: ChordST};

export type ChordGroup = {
    endAngle: number, index: number,
    startAngle: number, value: number,
};

export type ChordData = {
    chords: Chord[],
    chordGroups: ChordGroup[],
};

/** ********** MAIN ********** **/

export default function createChordData(data: Data): ChordData {
    const chordGenerator = chord()
        .padAngle(0.05)
        .sortSubgroups(descending)
        .sortChords(descending);

    const chords = chordGenerator(data);

    return {
        chords,
        chordGroups: chords.groups,
    }
}
