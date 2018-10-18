// @flow

import * as React from 'react';
import {range} from 'd3-array';

import Stage0 from './analytics/Stage0';
import Stage1 from './analytics/Stage1';
import Stage2 from './analytics/Stage2';
import Stage3 from './analytics/Stage3';
import Stage4 from './analytics/Stage4';

import type {Stagger} from '../main-chart/chart-funcs/drawChordDiagram';
import type {ColorData, Data, NameData} from '../../data/DataTypes';


export type ActiveRings = number[] | 'ALL';
export type ActiveRibbons = [number, number][] | 'ALL';  // [source, target][]

export type Stage = {
    activeRings: ActiveRings,
    activeRibbons: ActiveRibbons,
    analytics: ?React.Node,
    activeOpacity?: number,
    passiveOpacity?: number,
    ringsStagger?: Stagger,
    ribbonsStagger?: Stagger,
    ringsDuration?: number,
    ribbonsDuration?: number,
};

export type StageAnalyticsProps = {
    activeRings: ActiveRings,
    activeRibbons: ActiveRibbons,
    data: Data,
    nameData: NameData,
    colorScale: any,
}

export function createStage(
    activeRings: ActiveRings,
    activeRibbons: ActiveRibbons,
    analytics: ?React.Node,
): Stage {
    return {
        activeRings,
        activeRibbons,
        analytics,
    }
}

export function createNormalStage(): Stage {
    return {
        activeRings: [],
        activeRibbons: [],
        analytics: null,
    }
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

export function createWalkthroughStages(
    data: Data,
    nameData: NameData,
    colorScale: any,
): Stage[] {
    const walkthroughStages = [];

    // ***** Stage 0 ***** //

    const s0activeRings = 'ALL';
    const s0activeRibbons = 'ALL';

    walkthroughStages.push({
        activeRings: s0activeRings,
        activeRibbons: s0activeRibbons,
        analytics: <Stage0 activeRings={s0activeRings}
                           activeRibbons={s0activeRibbons}
                           data={data} nameData={nameData}
                           colorScale={colorScale} />,
    });

    // ***** Stage 1 ***** //

    const s1activeRings = [];
    const s1activeRibbons = [];
    const s1RingsStagger = (d, i) => i * 250;

    walkthroughStages.push({
        activeRings: s1activeRings,
        activeRibbons: s1activeRibbons,
        passiveOpacity: 0.05,
        ringsStagger: s1RingsStagger,
        ringsDuration: 1000,
        ribbonsDuration: data.length * 500,
        analytics: <Stage1 activeRings={s1activeRings}
                           activeRibbons={s1activeRibbons}
                           data={data} nameData={nameData}
                           colorScale={colorScale} />,
    });

    // ***** Stage 2 ***** //

    const s2activeRings = 'ALL';
    const s2activeRibbons = [];

    const s2RingsStagger = (d, i) => i * 1000;

    walkthroughStages.push({
        activeRings: s2activeRings,
        activeRibbons: s2activeRibbons,
        passiveOpacity: 0,
        ringsStagger: s2RingsStagger,
        ringsDuration: 1000,
        analytics: <Stage2 activeRings={s2activeRings}
                           activeRibbons={s2activeRibbons}
                           data={data} nameData={nameData}
                           colorScale={colorScale} />,
    });

    // ***** Stage 3 ***** //

    const s3activeRings = [];
    const s3activeRibbons = 'ALL';

    const s3RibbonsStagger = (d, i) => i * 250;

    walkthroughStages.push({
        activeRings: s3activeRings,
        activeRibbons: s3activeRibbons,
        passiveOpacity: 0,
        ribbonsStagger: s3RibbonsStagger,
        ringsDuration: 1000,
        ribbonsDuration: 500,
        analytics: <Stage3 activeRings={s3activeRings}
                           activeRibbons={s3activeRibbons}
                           data={data} nameData={nameData}
                           colorScale={colorScale} />,
    });

    // ***** Stage 4 ***** //

    const s4activeRings = [0, 1];
    const s4activeRibbons = [[0, 0]];

    walkthroughStages.push({
        activeRings: s4activeRings,
        activeRibbons: s4activeRibbons,
        passiveOpacity: 0,
        ringsDuration: 1000,
        ribbonsDuration: 1000,
        analytics: <Stage4 activeRings={s4activeRings}
                           activeRibbons={s4activeRibbons}
                           data={data} nameData={nameData}
                           colorScale={colorScale} />,
    });

    // ***** Stage Final ***** //

    walkthroughStages.push(createNormalStage());

    // ***** End ***** //

    return walkthroughStages
}
