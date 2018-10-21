// @flow

/**
 * Trim whitespaces at the start and end of a string
 * */
export default function trimWhitespaces(s: string): string {
    return s.replace(/\s+$|^\s/g, '');
}
