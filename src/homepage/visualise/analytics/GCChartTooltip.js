// @flow

import * as React from 'react';

type GCChartTooltipProps = {
    size: {width: number, height: number},
    text: string,
    color: string,
}

export default class GCChartTooltip extends React.PureComponent<GCChartTooltipProps, {}> {
    render() {
        const {size, text, color} = this.props;

        return (
            <div className="gc-chart-tooltip"
                 style={{
                     width: size.width,
                     height: size.height,
                     /*transform: 'translate('
                         + `-${size.width / 2}px,`
                         + `-${size.height / 2}px)`,*/
                 }}>
                <div className="gc-chart-tooltip-text"
                     style={color ? {color} : null}>
                    {text}
                </div>
            </div>
        )
    }
}
