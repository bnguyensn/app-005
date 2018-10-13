// @flow

import {EN_UK} from './createFormats';

import type {ColorData} from '../../../data/DataTypes';

type Tooltip = {
    text: string,
    pos: {top: number, left: number},
    color: string,
};

export default function generateTooltip(
    d: any,
    i: number,
    nodes: any,
    colorData: ?ColorData,
    scaleX: any,
): ?Tooltip {
    const parentNode = nodes[i].parentElement;
    const elRect = nodes[i].getBoundingClientRect();

    if (parentNode && elRect) {
        const className = nodes[i].getAttribute('class');

        let name, amount, color;

        if (className === 'asset-bar') {
            name = parentNode.__data__.key;
            amount = d[1] - d[0];
            color = colorData
                ? colorData.assets[name]
                : '#212121';
        } else {
            name = d.name;  // eslint-disable-line prefer-destructuring
            amount = d.amount;  // eslint-disable-line prefer-destructuring
            color = colorData
                ? colorData.assets['Remaining investment commitments']
                : '#212121';
        }

        const ttText = `${name}: ${EN_UK.format('$,.0f')(amount)}`;

        const ttPos = {
            top: elRect.top,
            left: elRect.left + scaleX.bandwidth() + 5,
        };

        return {
            text: ttText,
            pos: ttPos,
            color,
        }
    }

    return null
}
