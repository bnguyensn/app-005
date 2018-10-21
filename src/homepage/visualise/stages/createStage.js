// @flow

import * as React from 'react';
import {range} from 'd3-array';

import {animationFade, animationPulse}
    from '../main-chart/chart-funcs/animations/customAnimations';

import type {SelectorObj} from '../main-chart/chart-funcs/helpers';
import type {AnimationInfo} from '../main-chart/chart-funcs/animations/main';
import type {RingsSelector, RibbonsSelector}
    from '../main-chart/chart-funcs/drawChordDiagram';

export type StageEventInfo = {
    type: string,  // 'mouseenter', 'mouseleave'
    targetRingIndex?: RingsSelector,
    targetRibbonName?: RibbonsSelector,
    hRingsG?: RingsSelector,
    hRibbonsG?: RibbonsSelector,
};

export type Stage = {
    selectors: SelectorObj[],
    animInfo: AnimationInfo[],
    analytics: ?number,
    evtInfo?: StageEventInfo,
};

export function createNormalStage(): Stage {
    const transInfo = {dur: 300, easeFn: 'linear'};

    return {
        selectors: [
            {type: 'RINGS', selector: 'ALL'},
            {type: 'RIBBONS', selector: 'ALL'},
        ],
        animInfo: [
            {...transInfo, anim: animationFade(null, 1)},
            {...transInfo, anim: animationFade(null, 0.75)},
        ],
        analytics: null,
    }
}

export function createHighlightStage(
    hRingsG: RingsSelector,
    hRibbonsG: RibbonsSelector,
) {
    if (hRingsG === 'ALL' && hRibbonsG === 'ALL') {
        return createNormalStage()
    }

    const transInfo = {dur: 300, easeFn: 'linear'};

    return {
        selectors: [
            {type: 'RINGS', selector: 'ALL'},
            {type: 'RIBBONS', selector: 'ALL'},
            {type: 'RINGS', selector: hRingsG},
            {type: 'RIBBONS', selector: hRibbonsG},
        ],
        animInfo: [
            {...transInfo, anim: animationFade(null, 0.01)},
            {...transInfo, anim: animationFade(null, 0.01)},
            {...transInfo, anim: animationFade(null, 1)},
            {...transInfo, anim: animationFade(null, 0.75)},
        ],
        analytics: null,
    };
}

export const animationGen = (duration: number, delay: number) => (
    `opacity-in ${duration}s linear ${delay}s 1 normal forwards`
);

export const stylesGen = (length: number, duration: number, delay: number) => {
    const styles = [];
    for (let i = 0; i < length; i++) {
        styles.push({opacity: 0, animation: animationGen(duration, i * delay)});
    }
    return styles
};

// TODO: fix
export function createWalkthroughStages() {
    return []
}
/*
export function createWalkthroughStages(
    data: Data,
    nameData: NameData,
    colorScale: any,
): Stage[] {
    const walkthroughStages = [];

    // ***** Stage 0 ***** //

    const s0Rings0 = 'ALL';
    const s0Ribbons0 = 'ALL';

    walkthroughStages.push({
        selectors: [
            {type: 'RINGS', selector: s0Rings0},
            {type: 'RIBBONS', selector: s0Ribbons0},
        ],
        animInfo: [
            {
                dur: 2000,
                attrsEnd: [
                    {a: 'fill-opacity', v: 1},
                    {a: 'stroke-opacity', v: 1},
                ],
            },
            {
                dur: 2000,
                attrsEnd: [
                    {a: 'fill-opacity', v: 0.75},
                    {a: 'stroke-opacity', v: 0.75},
                ],
            },
        ],
        analytics: <Stage0 activeRings={s0Rings0}
                           activeRibbons={s0Ribbons0}
                           data={data} nameData={nameData}
                           colorScale={colorScale} />,
    });

    // ***** Stage 1 ***** //

    const s1Rings0 = 'ALL';
    const s1Ribbons0 = 'ALL';
    const s1Rings0Stagger = (d, i) => i * 250;

    walkthroughStages.push({
        selectors: [
            {type: 'RINGS', selector: s1Rings0},
            {type: 'RIBBONS', selector: s1Ribbons0},
        ],
        animInfo: [
            {
                dur: 1000,
                stagger: s1Rings0Stagger,
                attrsEnd: [
                    {a: 'fill-opacity', v: 0.13},
                    {a: 'stroke-opacity', v: 0.13},
                ],
            },
            {
                dur: data.length * 500,
                attrsEnd: [
                    {a: 'fill-opacity', v: 0.1},
                    {a: 'stroke-opacity', v: 0.1},
                ],
            },
        ],
        analytics: <Stage1 activeRings={s1Rings0}
                           activeRibbons={s1Ribbons0}
                           data={data} nameData={nameData}
                           colorScale={colorScale} />,
    });

    // ***** Stage 2 ***** //

    const s2Rings0 = 'ALL';
    const s2Ribbons0 = 'ALL';
    const s2Rings0Stagger = (d, i) => i * 1000;

    walkthroughStages.push({
        selectors: [
            {type: 'RINGS', selector: s2Rings0},
            {type: 'RIBBONS', selector: s2Ribbons0},
        ],
        animInfo: [
            {
                dur: 1000,
                stagger: s2Rings0Stagger,
                attrsEnd: [
                    {a: 'fill-opacity', v: 1},
                    {a: 'stroke-opacity', v: 1},
                ],
            },
            {
                dur: 500,
                attrsEnd: [
                    {a: 'fill-opacity', v: 0},
                    {a: 'stroke-opacity', v: 0},
                ],
            },
        ],
        analytics: <Stage2 activeRings={s2Rings0}
                           activeRibbons={s2Ribbons0}
                           data={data} nameData={nameData}
                           colorScale={colorScale} />,
    });

    // ***** Stage 3 ***** //

    const s3Rings0 = 'ALL';
    const s3Ribbons0 = 'ALL';

    const s3Ribbons0Stagger = (d, i) => i * 250;

    walkthroughStages.push({
        selectors: [
            {type: 'RINGS', selector: s3Rings0},
            {type: 'RIBBONS', selector: s3Ribbons0},
        ],
        animInfo: [
            {
                dur: 1000,
                attrsEnd: [
                    {a: 'fill-opacity', v: 0},
                    {a: 'stroke-opacity', v: 0},
                ],
            },
            {
                dur: 500,
                stagger: s3Ribbons0Stagger,
                attrsEnd: [
                    {a: 'fill-opacity', v: 0.75},
                    {a: 'stroke-opacity', v: 0.75},
                ],
            },
        ],
        analytics: <Stage3 activeRings={s3Rings0}
                           activeRibbons={s3Ribbons0}
                           data={data} nameData={nameData}
                           colorScale={colorScale} />,
    });

    // ***** Stage 4 ***** //

    const s4Rings0 = [0, 1];
    const s4Ribbons0 = ['1.0'];
    const s4Rings1 = getInvertedRings(data, s4Rings0);
    const s4Ribbons1 = getInvertedRibbons(data, s4Ribbons0);

    walkthroughStages.push({
        selectors: [
            {type: 'RINGS', selector: s4Rings0},
            {type: 'RINGS', selector: s4Rings1},
            {type: 'RIBBONS', selector: s4Ribbons0},
            {type: 'RIBBONS', selector: s4Ribbons1},
        ],
        animInfo: [
            {
                dur: 1000,
                attrsEnd: [
                    {a: 'fill-opacity', v: 1},
                    {a: 'stroke-opacity', v: 1},
                ],
            },
            {
                dur: 1000,
                attrsEnd: [
                    {a: 'fill-opacity', v: 0},
                    {a: 'stroke-opacity', v: 0},
                ],
            },
            {
                dur: 1000,
                attrsEnd: [
                    {a: 'fill-opacity', v: 0.75},
                    {a: 'stroke-opacity', v: 0.75},
                ],
            },
            {
                dur: 1000,
                attrsEnd: [
                    {a: 'fill-opacity', v: 0},
                    {a: 'stroke-opacity', v: 0},
                ],
            },
        ],
        analytics: <Stage4 activeRings={s4Rings0}
                           activeRibbons={s4Ribbons0}
                           data={data} nameData={nameData}
                           colorScale={colorScale} />,
    });

    // ***** Stage Final ***** //

    walkthroughStages.push(createNormalStage());

    // ***** End ***** //

    return walkthroughStages
}
*/
