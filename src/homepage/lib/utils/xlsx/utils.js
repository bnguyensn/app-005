// @flow

export function colNumToColName(n: number): string {
    try {
        // Assuming column 0 = A

        let dividend = n;
        let colName = '';
        let modulo;

        while (dividend > 0) {
            modulo = dividend % 26;
            colName += String.fromCharCode(65 + modulo);
            dividend = parseInt((dividend - modulo) / 26, 10);
        }

        return colName || 'A'
    } catch (e) {
        return e
    }
}
