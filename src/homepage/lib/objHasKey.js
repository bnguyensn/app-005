// @flow

export default function objHasKey(obj: {}, key: string) {
    return Object.prototype.hasOwnProperty.call(obj, key)
}
