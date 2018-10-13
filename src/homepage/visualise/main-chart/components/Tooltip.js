// @flow

import * as React from 'react';

import './tooltip.css';

type ChartTooltipProps = {
    tooltip: {
        show: boolean,
        text: string,
        pos: {top: number, left: number},
        color: string,
    }
};

export default class Tooltip
    extends React.PureComponent<ChartTooltipProps, {}> {
    render() {
        const {tooltip} = this.props;
        const {show, text, pos, color} = tooltip;

        return (
            <div className={`chart-tooltip ${show ? '' : 'hidden'}`}
                 style={{
                     top: `${pos.top}px`,
                     left: `${pos.left}px`,
                     backgroundColor: `${color}`,
                 }}>
                {text}
            </div>
        )
    }
}
