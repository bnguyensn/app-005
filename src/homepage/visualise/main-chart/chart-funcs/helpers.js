// @flow

export function selectionHasClass(s: any, cls: string): boolean {
    try {
        return s.attr('class').split(' ').includes(cls);
    } catch (e) {
        return false
    }
}
