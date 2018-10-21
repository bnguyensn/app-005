// @flow

import * as React from 'react';

import {ClickableDiv} from '../../../lib/components/Clickable';
import isNumber from '../../../lib/isNumber';
import {getHGroupsFromRibbon, getHGroupsFromRing} from '../../../data/helpers';
import {createHighlightStage, createNormalStage} from '../../stages/createStage';

import type {Data, DataConfig} from '../../../data/DataTypes';
import {formatAmount} from '../helpers';

export function DisplayGeneric(props: {value: string | number}) {
    const {value, ...rest} = props;

    return (
        <span {...rest}>{value}</span>
    )
}

export function DisplayNumber(props: {
    dataConfig: DataConfig, p?: boolean, value: string | number
}) {
    const {dataConfig, p, value, ...rest} = props;

    return (
        <span {...rest}>{formatAmount(dataConfig, value, p)}</span>
    )
}

export function DisplayStageCreator(props: {
    data: Data,
    hType: 'RINGS' | 'RIBBONS' | 'ALL',
    hValue: ?number | ?number[],
    children?: React.Node,
    changeState: (string, any) => void,
}) {
    const {data, hType, hValue, children, changeState, rest} = props;

    const handleClick = (e) => {
        if (hType === 'ALL') {
            const newStage = createNormalStage();
            changeState('stages', [newStage]);
        } else {
            let ringsG, ribbonsG;

            if (hType === 'RINGS' && isNumber(hValue)) {
                [ringsG, ribbonsG] = getHGroupsFromRing(data, hValue);
            } else if (hType === 'RIBBONS' && Array.isArray(hValue)) {
                [ringsG, ribbonsG] = getHGroupsFromRibbon(data, ...hValue);
            }

            if (ringsG && ribbonsG) {
                const newStage = createHighlightStage(ringsG, ribbonsG);
                changeState('stages', [newStage]);
            }
        }
    };

    return (
        <ClickableDiv className="clickable"
                      action={handleClick}
                      {...rest}>
            {children}
        </ClickableDiv>
    )
}
