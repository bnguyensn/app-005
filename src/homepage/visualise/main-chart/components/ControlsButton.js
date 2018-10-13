// @flow

import * as React from 'react';

import {ClickableDiv} from '../../../lib/components/Clickable';

type ChartButtonsProps = {
    title: string,
    action: () => void,
    children?: React.Node,
}

export default function ChartButtons(props: ChartButtonsProps) {
    const {title, action, children} = props;

    const handleClick = () => {
        action();
    };

    return (
        <ClickableDiv className="main-chart-controls-button"
                      title={title}
                      action={handleClick}>
            {children}
        </ClickableDiv>
    )
}
