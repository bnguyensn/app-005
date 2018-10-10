// @flow

import * as React from 'react';

type ChartButtonsProps = {
    resetChartPosition: () => void,
}

export default function ChartButtons(props: ChartButtonsProps) {
    const handleRClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
        const {resetChartPosition} = props;

        resetChartPosition();
    };

    const handleRKeyPress = (e: SyntheticKeyboardevent<HTMLDivElement>) => {
        const {resetChartPosition} = props;

        if (key === 'enter') {
            resetChartPosition();
        }
    };

    return (
        <div className="chart-buttons">
            <div className="chart-button"
                 title="Reset chart position"
                 role="button" tabIndex={0}
                 onClick={handleRClick}
                 onKeyPress={handleRKeyPress}>
                R
            </div>
        </div>
    )
}
