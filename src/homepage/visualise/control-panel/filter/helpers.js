// @flow

export type Range = number[];

export function addToIndices(indexLimit: number, indices: Set<number>, i: number) {
    const adjI = i - 1;

    if (adjI <= indexLimit && adjI >= 0) {
        indices.add(adjI);
    }
}

export function addToRanges(
    indexLimit: number,
    ranges: Range[],
    r: Range,
    adj: boolean,
) {
    const adjR = adj ? r.map(n => n - 1) : r;

    if (adjR[0] <= indexLimit
        && adjR[1] <= indexLimit
        && adjR[0] >= 0
        && adjR[1] >= 0
    ) {
        ranges.push(adjR);
    }
}

export function addToRangesP(
    indexLimit: number,
    ranges: Range[],
    rP: Range,
) {
    const r = rP.map((p, index) => (
        index === 0
            ? Math.floor((p / 100) * (indexLimit + 1))
            : Math.ceil((p / 100) * (indexLimit + 1) - 1)
    ));
    addToRanges(indexLimit, ranges, r, false);
}

export function rangesToIndices(ranges: Range[], indices: Set<number>) {
    ranges.forEach((r) => {
        const arrLength = r[1] - r[0] + 1;

        // Create an array filled with indices
        const arr = Array.from(
            new Array(arrLength),
            (val, index) => r[0] + index,
        );

        // Simply add these indices to the Set.
        // No need to check for indexLimit here. Everything is within limit
        // when this function is called.
        arr.forEach((val) => {
            indices.add(val);
        });
    });
}
