// @flow

import type {SelectorObj} from '../main-chart/chart-funcs/helpers';
import type {DisplayConfig} from '../../data/DataTypes';

export function getRingsRibbons(selectors: SelectorObj[]) {
    if (selectors && selectors.length > 0) {
        const rings = selectors.filter(selector => selector.type === 'RINGS');
        const ribbons = selectors.some(selector => selector.type === 'RIBBONS');

        return [rings, ribbons]
    }

    return [null, null]
}

export function formatAmount(
    displayConfig: DisplayConfig,
    amt: number | string,
    p?: boolean = false,
): string {
    const {amtPrefix, amtSuffix, amtRounding} = displayConfig;

    if (p) {
        return `${(Number(amt) * 100).toFixed(2)}%`
    }

    const amtF = Number(amt).toLocaleString(
        undefined,
        {
            minimumFractionDigits: amtRounding,
            maximumFractionDigits: amtRounding,
        },
    );

    return `${amtPrefix}${amtF}${amtSuffix}`
}

export const dataTypeAdjMapper = {
    normal: ' to',
    transpose: ' from',
    net: ' with',
    gross: ' with',
};
