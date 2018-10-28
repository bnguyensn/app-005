// @flow

import {select} from 'd3-selection';
import {transition} from 'd3-transition';
import {easeLinear, easeCubic} from 'd3-ease';
import {interpolateString} from 'd3-interpolate';

/** ********** TYPES ********** **/

export type AnimationStagger = number
    | (d: any, i: number, nodes: any) => number;

export type AnimationFn = () => void;

export type AnimationInfo = {
    dur: number,
    stagger?: AnimationStagger,
    easeFn?: any,
    anim: AnimationFn,
}

/** ********** CONFIGS ********** **/

const DEFAULT_EASE = easeCubic;

const EASE_MAPPPING = {
    linear: easeLinear,
    cubic: easeCubic,
};

/** ********** MAIN ********** **/

/**
 * Return a selection / transition instance
 * */
export default function animateSelection(sel: any, animInfo: AnimationInfo) {
    const {
        dur,
        stagger = 0,
        easeFn,
        anim,
    } = animInfo;

    const easing = easeFn && EASE_MAPPPING[easeFn]
        ? EASE_MAPPPING[easeFn]
        : DEFAULT_EASE;

    return sel.transition()
        .duration(dur)
        .delay(stagger)
        .ease(easing)
        .on('start', anim);
}
