// @flow

export type D3SelectionEventHandler = (d: any, i: number, nodes: any) => void;

export type D3EventAction = {
    event: string,
    action: D3SelectionEventHandler,
};
