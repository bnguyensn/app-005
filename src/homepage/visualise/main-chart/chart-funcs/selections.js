// @flow

export type RingsSelector = number[] | 'ALL';
export type RibbonsSelector = string[] | 'ALL';  // ['sourceI.targetI', ...][]
export type SelectFn = (
    p: any,
    selector: RingsSelector | RibbonsSelector,
) => ?any;

export function selectRings(
    p: any,  // Parent selection
    selector: RingsSelector,
): ?any {
    const ringsAll = p.selectAll('.chord-ring');

    if (selector === 'ALL') return ringsAll;

    if (Array.isArray(selector) && selector.length > 0) {
        return ringsAll.filter((d: any) => (
            selector.includes(d.index)
        ))
    }

    return null
}

export function selectRibbons(
    p: any,  // Parent selection
    selector: RibbonsSelector,
): ?any {
    const ribbonsAll = p.selectAll('.chord-ribbon');

    if (selector === 'ALL') return ribbonsAll;

    if (Array.isArray(selector) && selector.length > 0) {
        return ribbonsAll
            .filter((d: any) => {
                const curName = `${d.source.index}.${d.target.index}`;
                const curNameR = `${d.target.index}.${d.source.index}`;

                return selector.includes(curName) || selector.includes(curNameR)
            });
    }

    return null
}


