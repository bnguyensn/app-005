// @flow

import * as React from 'react';

type LabelProps = {
    color: string,
    asset: string,
    toggleColorMenu: (asset: string, el: HTMLDivElement) => void,
};

export default function Label(props: LabelProps) {
    const {color, asset, toggleColorMenu} = props;

    const handleColorSquareClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
        toggleColorMenu(asset, e.currentTarget);
    };

    const handleColorSquareKeyPress = (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'enter') {
            toggleColorMenu(asset, e.currentTarget);
        }
    };

    return (
        <div className="legend-label">
            <div className="legend-label-color-square"
                 role="button" tabIndex={0}
                 style={{
                     backgroundColor: color,
                 }}
                 onClick={handleColorSquareClick}
                 onKeyPress={handleColorSquareKeyPress} />
            <div className="legend-label-text">
                {asset}
            </div>
        </div>
    )
}
