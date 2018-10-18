// @flow

import * as React from 'react';

import {color as d3Color} from 'd3-color';

import {ClickableDiv} from '../../../lib/components/Clickable';

type ColorButtonProps = {
    color: string,
    submitNewColor: (color: string) => void,
}

export default function ColorButton(props: ColorButtonProps) {
    const {color, submitNewColor} = props;

    const handleClick = () => {
        // Only change color if color string is valid

        if (d3Color(color)) {
            submitNewColor(d3Color(color).hex());
        }
    };

    return (
        <ClickableDiv className="legend-color-menu-color-btn"
                      style={{
                          backgroundColor: `${d3Color(color) || 'initial'}`,
                      }}
                      action={handleClick} />
    )
}
