// @flow

import * as React from 'react';

import './tooltip.css';

type TooltipProps = {
    posT: number,
    posL: number,
    posOffsetX: string,
    posOffsetY: string,
    children: ?React.Node,
};

export default class Tooltip
    extends React.PureComponent<TooltipProps, {}> {
    render() {
        const {posT, posL, posOffsetX, posOffsetY, children} = this.props;

        return (
            <div className="tooltip"
                 style={{
                     top: `${posT}px`,
                     left: `${posL}px`,
                     transform: `translate(${posOffsetX}, ${posOffsetY})`,
                 }}>
                {children}
            </div>
        )
    }
}
