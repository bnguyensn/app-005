// @flow

import * as React from 'react';

type ChartTooltipProps = {
    show: boolean,
    text: string,
    pos: {top: number, left: number},
    color: string,
};

export default class ChartTooltip extends React.PureComponent<ChartTooltipProps, {}> {
    render() {
        const {show, text, pos, color} = this.props;

        return (
            <div className={`chart-tooltip ${show ? '' : 'hidden'}`}
                 style={{
                     top: `${pos.top}px`,
                     left: `${pos.left}px`,
                     backgroundColor: `${color}`,
                     // transform: `translate(${pos.x}px, ${pos.y}px)`,
                 }}>
                {text}
            </div>
        )
    }
}
