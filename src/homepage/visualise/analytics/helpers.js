// @flow

import type {SelectorObj} from '../main-chart/chart-funcs/helpers';
import type {DataConfig} from '../../data/DataTypes';

export function getRingsRibbons(selectors: SelectorObj[]) {
    if (selectors && selectors.length > 0) {
        const rings = selectors.filter(selector => selector.type === 'RINGS');
        const ribbons = selectors.some(selector => selector.type === 'RIBBONS');

        return [rings, ribbons]
    }

    return [null, null]
}

export function formatAmount(
    dataConfig: DataConfig,
    amt: number,
    p?: boolean = false,
): string {
    const {amtPrefix, amtSuffix, amtRounding} = dataConfig;

    if (p) {
        return `${(amt * 100).toFixed(2)}%`
    }

    const amtF = amt.toLocaleString(
        undefined,
        {
            minimumFractionDigits: amtRounding,
            maximumFractionDigits: amtRounding,
        },
    );

    return `${amtPrefix}${amtF}${amtSuffix}`
}
