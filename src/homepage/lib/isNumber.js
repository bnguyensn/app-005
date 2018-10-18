// @flow

export default function isNumber(n: any): boolean {
    const intAmount = parseInt(n, 10);

    return typeof intAmount === 'number' && !(Number.isNaN(intAmount))
}
