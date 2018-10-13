// @flow

export default function compose(...funcs: any[]) {
    return (BaseComponent: any) => (
        funcs.reduce((acc, hoc) => hoc(acc), BaseComponent)
    )
}
