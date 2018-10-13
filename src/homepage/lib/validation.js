// @flow

export function isFileOfType(file: File, types: string[]): boolean {
    return types.includes(file.type)
}
