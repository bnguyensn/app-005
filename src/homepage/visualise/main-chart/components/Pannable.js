// @flow

import * as React from 'react';
import Draggable from 'react-draggable';

export type DraggableData = {
    node: HTMLElement,
    // lastX + deltaX === x
    x: number, y: number,
    deltaX: number, deltaY: number,
    lastX: number, lastY: number
};

type PannableProps = {
    translateX: number,
    pannableOnDrag: (e: Event, data: DraggableData) => void,
    children?: React.Node,
};

export default class Pannable extends React.PureComponent<PannableProps, {}> {
    render() {
        const {translateX, pannableOnDrag, children} = this.props;
        return (
            <Draggable axis="x"
                       handle=".pannable"
                       defaultPosition={{x: 0, y: 0}}
                       position={{x: translateX, y: 0}}
                       onDrag={pannableOnDrag}
            >
                <g id="pannable" className="pannable">
                    {children}
                </g>
            </Draggable>
        )
    }
}
