// @flow

import {select} from 'd3-selection';
import {easeLinear, easeCubic, easeExpOut} from 'd3-ease';
import {interpolate} from 'd3-interpolate';
import {rgb} from 'd3-color';

import createArc from './createArc';
import createRibbon from './createRibbon';
import wrapText from './wrapText';

import type {ArcChartSize} from '../../chartSizes';
import type {Chord, ChordGroup} from './createChordData';
import type {ColorScale, NameData} from '../../data/Types';

/** ********** CONFIGS ********** **/

const EASE_DEFAULT = easeLinear;

const animInfoH = {
    dur: 300,
    easeFn: easeLinear,
};

const animInfo = {
    dur: 1000,
    easeFn: easeExpOut,
};

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

/** ********** UPDATERS ********** **/

export function updateHighlight(
    s: any,  // Selection of rings '.chord-ring
    endOp: number,
) {
    s.transition()
        .duration(animInfoH.dur)
        .ease(animInfoH.easeFn || EASE_DEFAULT)
        .attr('fill-opacity', endOp)
        .attr('stroke-opacity', endOp);

    return s
}

export function updateRingsProperties(
    s: any,  // Selection of rings '.chord-ring'
    prevData: ChordGroup[],
    size: ArcChartSize,
) {
    const a = createArc(size);

    s.each(function update(d: any) {
        select(this).select('path')
            .transition()
            .duration(animInfo.dur)
            .ease(animInfo.easeFn || EASE_DEFAULT)
            .attrTween('d', createRingTween(
                prevData
                    ? prevData[d.index]
                    : {...d, endAngle: d.startAngle},
                a,
            ))
            .on('interrupt', function interrupted() {
                select(this).attr('d', a);
            });
    });

    return s
}

export function updateRibbonsProperties(
    s: any,  // Selection of ribbons '.chord-ribbon'
    prevData: ?Chord[],
    size: ArcChartSize,
) {
    const r = createRibbon(size);

    s.each(function update(d: any) {
        let prevD;

        if (prevData) {
            const prevNames = prevData
                .map(c => `${c.source.index}.${c.target.index}`);

            const curName = `${d.source.index}.${d.target.index}`;
            const curNameR = `${d.target.index}.${d.source.index}`;

            let prevI = prevNames.indexOf(curName);
            if (prevI !== -1) {
                prevD = prevData[prevI];
            } else {
                prevI = prevNames.indexOf(curNameR);
                if (prevI !== -1) {
                    prevD = {
                        source: {...prevData[prevI].target},
                        target: {...prevData[prevI].source},
                    };
                }
            }
        }

        if (!prevD) {
            prevD = {
                source: {
                    ...d.source,
                    endAngle: d.source.startAngle,
                },
                target: {
                    ...d.target,
                    endAngle: d.target.startAngle,
                },
            };
        }

        select(this).transition()
            .duration(animInfo.dur)
            .ease(animInfo.easeFn || EASE_DEFAULT)
            .attrTween('d', createRibbonTween(prevD, r))
            .on('interrupt', function interrupted() {
                select(this).attr('d', r);
            });
    });

    return s
}

export function updateRingsLabels(
    s: any,  // Selection of rings '.chord-ring'
    nameData: NameData,
    size: ArcChartSize,
) {
    const chartWidth = size.width + size.margin.left + size.margin.right;

    s.each(function update(d: any) {
        const txt = select(this).select('.chord-ring-label-text');

        const angle = (d.startAngle + d.endAngle) / 2;

        txt.text(d => nameData[d.index])
            .attr('font-size', 20 * 0.9 * (size.width / 480))
            .transition()
            .duration(animInfo.dur)
            .ease(animInfo.easeFn || EASE_DEFAULT)
            .attr('stroke-width', 0)
            .attr('dy', '.35em')
            .attr('text-anchor', angle > Math.PI ? 'end' : null)
            .attr('transform',
                `rotate(${angle * 180 / Math.PI - 90}) `
                + `translate(${size.innerRadius + (chartWidth / 20)}) `
                + `${angle > Math.PI ? 'rotate(180)' : ''}`);

        txt.call(wrapText, 100);
    });

    return s
}

export function updateRingsColor(
    s: any,  // Selection of rings '.chord-ring'
    colorScale: ColorScale,
) {
    s.attr('fill', d => colorScale(d.index))
        .attr('stroke', d => rgb(colorScale(d.index)).darker());

    return s
}

export function updateRibbonsColor(
    s: any,  // Selection of ribbons '.chord-ribbon'
    colorScale: ColorScale,
) {
    s.attr('fill', d => colorScale(d.source.index))
        .attr('stroke', d => rgb(colorScale(d.source.index)).darker());

    return s
}
