// @flow

import * as React from 'react';

import {color as d3Color} from 'd3-color';

type ColorButtonProps = {
    color: string,
    changeColor: (color) => void,
}

export default function ColorButton(props: ColorButtonProps) {
    const {color, changeColor} = props;

    const handleClick = () => {
        // Only change color if color string is valid

        if (d3Color(color)) changeColor(color);
    };

    const handleKeyPress = (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'enter') {
            // Only change color if color string is valid

            if (d3Color(color)) changeColor(color);
        }
    };

    return (
        <div className="legend-color-menu-color-btn"
             role="button" tabIndex={0}
             style={{backgroundColor: `${d3Color(color) || 'initial'}`}}
             onClick={handleClick}
             onKeyPress={handleKeyPress} />
    )
}
