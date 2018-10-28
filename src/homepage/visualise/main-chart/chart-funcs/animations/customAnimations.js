// @flow

import {select} from 'd3-selection';
import {active} from 'd3-transition';
import {interpolate, interpolateString} from 'd3-interpolate';
import {getCurXformVals, getNextXform} from './helpers';
import trimWhitespaces from '../../../../lib/trimWhitespaces';
import createArc from '../createArc';

import type {Chord, ChordGroup} from '../createChordData';
import type {ArcChartSize} from '../../../chartSizes';

/** ********** HELPERS ********** **/

function createRingTween(prevD: ChordGroup, arcFn: ({}) => string) {
    return function factory(d: any) {
        const I = interpolate(prevD, d);

        return function valueCreator(t) {
            return arcFn(I(t))
        }
    }
}

function createRibbonTween(prevD: Chord, ribbonFn: ({}) => string) {
    return function factory(d: any) {
        const I = interpolate(prevD, d);

        return function valueCreator(t) {
            return ribbonFn(I(t))
        }
    }
}

/** ********** ANIMATIONS ********** **/

export function animationFade(
    startOpacity: ?number,
    endOpacity: number,
    repeat?: boolean = false,
) {
    const startOp = startOpacity;
    const endOp = endOpacity;
    const r = repeat;

    return function f() {
        if (startOpacity !== null) {
            select(this).attr('fill-opacity', startOp)
                .attr('stroke-opacity', startOp);
        }

        const t = active(this)
            .attr('fill-opacity', endOp)
            .attr('stroke-opacity', endOp);

        if (r) {
            t.transition()
                .on('start', f);
        }

        return t
    }
}

export function animationPulse(
    startOpacity: number,
    endOpacity: number,
    repeat?: boolean = false,
) {
    const startOp = startOpacity;
    const endOp = endOpacity;
    const r = repeat;

    return function f() {
        const t = active(this)
            .attr('fill-opacity', endOp)
            .attr('stroke-opacity', endOp)
            .transition()
            .attr('fill-opacity', startOp)
            .attr('stroke-opacity', startOp);

        if (r) {
            t.transition()
                .on('start', f);
        }

        return t
    }
}

export function updateRingsProperties(
    arcFn: ({}) => void,
    prevData: ChordGroup,
    repeat?: boolean = false,
) {
    const a = arcFn;
    const pD = prevData;
    const r = repeat;

    return function f() {
        const t = active(this)
            .attrTween('d', createRingTween(pD, a));

        if (r) {
            t.transition()
                .on('start', f);
        }

        return t
    }
}

export function animationRotate(
    degree: number,
    xyObj: ?{x: number, y: number},
    repeat?: boolean = false,
) {
    const deg = degree;
    const x = xyObj ? xyObj.x : '';
    const y = xyObj ? xyObj.y : '';
    const r = repeat;

    return function f() {
        const t = active(this)
            .attrTween('transform', function interpolator() {
                const curXformVals = getCurXformVals(
                    this.getAttribute('transform'),
                    ['rotate'],
                );

                console.log(`curVals = ${JSON.stringify(curXformVals)}`);

                if (curXformVals.rotate) {
                    const curDeg = curXformVals.rotate.split(' ')[0];

                    const nextXformRotateVal = trimWhitespaces(
                        `${Number(curDeg) + Number(deg)} ${x} ${y}`,
                    );

                    const nextXformRotate = `rotate(${nextXformRotateVal})`;

                    return interpolateString(
                        'rotate(0)',
                        getNextXform(
                            'rotate(0)',
                            {rotate: nextXformRotate},
                        ),
                    );
                }

                return this.getAttribute('transform')
            });

        if (r) {
            t.transition()
                .on('start', f);
        }

        return t
    }
}
