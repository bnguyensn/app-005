// @flow

type ChartMargins = {
    top: number, right: number, bottom: number, left: number,
};

/** ********** MAIN CHART (STACKED BAR) ********** **/

export type MainChartSize = {
    margin: ChartMargins, width: number, height: number
};

const mainChartMargin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
};

export const mainChartSize = {
    margin: mainChartMargin,
    width: 640 - mainChartMargin.left - mainChartMargin.right,
    height: 640 - mainChartMargin.top - mainChartMargin.bottom,
};

/** ********** ASSETS CHART (SUNBURST) ********** **/

export type AssetsChartSize = {
    margin: ChartMargins,
    width: number, height: number,
    radius: number,
    scaleFactor: number,
};

const assetsChartMargins = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
};

export const assetsChartSize = {
    margin: assetsChartMargins,
    width: 320 - assetsChartMargins.left - assetsChartMargins.right,
    height: 320 - assetsChartMargins.top - assetsChartMargins.bottom,
    get radius() {
        return Math.min(this.width, this.height) / 2
    },
    scaleFactor: 2,
};

/** ********** GOING CONCERN CHART (DONUT) ********** **/

export type GCChartSize = {
    margin: ChartMargins,
    width: number, height: number,
    radius: number,
    scaleFactor: number,
};

const gcChartMargins = {top: 10, right: 10, bottom: 10, left: 10};

export const gcChartSize = {
    margin: gcChartMargins,
    width: 320 - gcChartMargins.left - gcChartMargins.right,
    height: 320 - gcChartMargins.top - gcChartMargins.bottom,
    get radius() {
        return Math.min(this.width, this.height) / 2
    },
    scaleFactor: 2,
};
