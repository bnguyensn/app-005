// @flow

type ChartMargins = {
    top: number, right: number, bottom: number, left: number,
};

/** ********** MAIN CHART ********** **/

export type ArcChartSize = {
    margin: ChartMargins,
    width: number, height: number,
    innerRadius: number, outerRadius: number,
};

const mcMargin = {
    top: 120,
    right: 120,
    bottom: 120,
    left: 120,
};

const mcWidth = 800 - mcMargin.left - mcMargin.right;
const mcHeight = Math.min(800 - mcMargin.top - mcMargin.bottom, mcWidth);
const mcOuterRadius = Math.min(mcWidth, mcHeight) * 0.5 - 30;
const mcInnerRadius = mcOuterRadius - 20;

export const mainChartSize = {
    margin: mcMargin,
    width: mcWidth,
    height: mcHeight,
    outerRadius: mcOuterRadius,
    innerRadius: mcInnerRadius,
};
