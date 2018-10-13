// @flow

import {formatLocale} from 'd3-format';

import enUKLocaleDef from '../d3-locales/en-UK';

const CHAR_LIM = 40;
const EN_UK = formatLocale(enUKLocaleDef);

export function restrictTooltipString(s: string): string {
    if (s.length > CHAR_LIM) {
        return `${s.slice(0, s.length - 3)}...`
    }
    return s
}

export function restrictTooltipNumberString(s: string, n: number): string {
    if (s.length > CHAR_LIM) {
        return EN_UK.format('$~s')(n)
    }
    return s
}
