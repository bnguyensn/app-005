// @flow

import * as React from 'react';

import type {AssetsChartSize} from './AssetsChart';

type AssetsChartTooltipProps = {
    size: AssetsChartSize,
    texts: {
        top: string,
        mid: string,
        bot: string,
    },
    textColors: {
        topC: string,
        midC: string,
        botC: string,
    }
};

export default class AssetsChartTooltip extends React.PureComponent<AssetsChartTooltipProps, {}> {
    render() {
        const {size, texts, textColors} = this.props;
        const {top, mid, bot} = texts;
        const {topC, midC, botC} = textColors;

        return (
            <div className="assets-chart-tooltip"
                 style={{
                     width: size.width,
                     height: size.height,
                     transform: 'translate('
                         + `-${size.width / 2}px,`
                         + `-${size.height / 2}px)`,
                 }}>
                <div className="assets-chart-tooltip-top"
                     style={topC ? {color: topC} : null}>
                    {top}
                </div>
                <div className="assets-chart-tooltip-mid"
                     style={midC ? {color: midC} : null}>
                    {mid}
                </div>
                <div className="assets-chart-tooltip-bot"
                     style={botC ? {color: botC} : null}>
                    {bot}
                </div>
            </div>
        )
    }
}
