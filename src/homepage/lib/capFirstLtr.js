// @flow

import trimWhitespaces from './trimWhitespaces';

export default function capFirstLetter(s: string): string {
    const sNoWS = trimWhitespaces(s);
    return `${sNoWS.charAt(0).toUpperCase()}${sNoWS.slice(1)}`
}
