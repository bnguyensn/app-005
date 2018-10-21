// @flow

import {select} from 'd3-selection'
import {transition} from 'd3-transition';
import {easeLinear, easeCubic} from 'd3-ease';
import {interpolateString} from 'd3-interpolate';

import {selectChordRibbons, selectChordRings} from './drawChordDiagram';

import type {RibbonsSelector, RingsSelector} from './drawChordDiagram';

/** ********** TYPES ********** **/

export type NormalSelector = string;

export type SelectorObj = {
    type: 'RINGS' | 'RIBBONS' | 'NORMAL' | '',
    selector: RingsSelector | RibbonsSelector | NormalSelector,
};

export type D3SelectionEventHandler = (d: any, i: number, nodes: any) => void;

export type D3EventAction = {
    event: string,
    action: D3SelectionEventHandler,
};

/** ********** SELECTIONS ********** **/

export function selectionHasClass(s: any, cls: string): boolean {
    try {
        return s.attr('class').split(' ').includes(cls);
    } catch (e) {
        return false
    }
}

export function selectNormal(parent: any, selector: string): ?any {
    return parent.selectAll(selector)
}

export function getSelectorFn(selector: SelectorObj): any {
    if (selector.type === 'RINGS') {
        return selectChordRings
    }

    if (selector.type === 'RIBBONS') {
        return selectChordRibbons
    }

    return selectNormal
}
