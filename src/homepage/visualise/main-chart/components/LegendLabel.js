// @flow

import * as React from 'react';

import {ClickableDiv} from '../../../lib/components/Clickable';

type LabelProps = {
    color: string,
    assetName: string,
    toggleColorMenu: (asset: string, el: HTMLDivElement) => void,
};

export default function Label(props: LabelProps) {
    const {color, assetName, toggleColorMenu} = props;

    const handleClick = (e: SyntheticEvent<HTMLElement>) => {
        toggleColorMenu(assetName, e.currentTarget);
    };

    return (
        <div className="legend-label">
            <ClickableDiv className="legend-label-color-square"
                          style={{
                              backgroundColor: color,
                          }}
                          action={handleClick} />
            <div className="legend-label-text">
                {assetName}
            </div>
        </div>
    )
}
