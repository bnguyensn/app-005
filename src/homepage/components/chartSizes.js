/** ********** MAIN CHART (STACKED BAR) ********** **/

const mainChartMargins = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
};

export const mainChartSize = {
    width: 640 - mainChartMargins.left - mainChartMargins.right,
    height: 640 - mainChartMargins.top - mainChartMargins.bottom,
    marginTop: 50,
    marginRight: 50,
    marginBottom: 50,
    marginLeft: 50,
};

/** ********** ASSETS CHART (SUNBURST) ********** **/

const assetsChartMargins = {top: 10, right: 10, bottom: 10, left: 10};

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
