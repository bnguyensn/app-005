// @flow

import * as React from 'react';

import {ClickableDiv} from '../../../lib/components/Clickable';

type LabelProps = {
    color: string,
    itemName: string,
    toggleColorMenu: (itemName: string, el: HTMLDivElement) => void,
};

export default function Label(props: LabelProps) {
    const {color, itemName, toggleColorMenu} = props;

    const handleClick = (e: SyntheticEvent<HTMLDivElement>) => {
        toggleColorMenu(itemName, e.currentTarget);
    };

    return (
        <div className="legend-label">
            <ClickableDiv className="legend-label-color-square"
                          style={{
                              backgroundColor: color,
                          }}
                          action={handleClick} />
            <div className="legend-label-text">
                {itemName}
            </div>
        </div>
    )
}
