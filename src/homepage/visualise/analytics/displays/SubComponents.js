// @flow

import * as React from 'react';

import {getHGroupsFromRibbon, getHGroupsFromRing} from '../../data/helpers/helpers';
import {createHighlightStage, createNormalStage}
    from '../../stages/createStage';
import {formatAmount} from '../helpers';
import {ClickableDiv} from '../../../lib/components/Clickable';

import type {Data, DataConfig, DisplayConfig} from '../../data/Types';

export function ADNam(props: {value: string | number}) {
    const {value, ...rest} = props;

    return (
        <span {...rest}>{value}</span>
    )
}

export function ADNum(props: {
    displayConfig: DisplayConfig,
    p?: boolean,
    value: string | number,
}) {
    const {displayConfig, p, value, ...rest} = props;

    return (
        <span {...rest}>{formatAmount(displayConfig, value, p)}</span>
    )
}

export function ADStagerHLRings(props: {
    data: Data,
    ring: number,
    changeState: (string, any) => void,
    children?: React.Node,
}) {
    const {data, ring, changeState, children, ...rest} = props;

    const handleClick = (e) => {
        const [ringsG, ribbonsG] = getHGroupsFromRing(data, ring);

        if (ringsG && ribbonsG) {
            const newStage = createHighlightStage(ringsG, ribbonsG);
            changeState('stages', [newStage]);
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

export function ADStagerHLRibbons(props: {
    data: Data,
    ribbonS: number,
    ribbonT: number,
    changeState: (string, any) => void,
    children?: React.Node,
}) {
    const {data, ribbonS, ribbonT, changeState, children, ...rest} = props;

    const handleClick = (e) => {
        const [ringsG, ribbonsG] = getHGroupsFromRibbon(data, ribbonS, ribbonT);

        if (ringsG && ribbonsG) {
            const newStage = createHighlightStage(ringsG, ribbonsG);
            changeState('stages', [newStage]);
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

export function ADStagerHLAll(props: {
    children?: React.Node,
    changeState: (string, any) => void,
}) {
    const {children, changeState, ...rest} = props;

    const handleClick = (e) => {
        const newStage = createNormalStage();
        changeState('stages', [newStage]);
    };

    return (
        <ClickableDiv className="clickable"
                      action={handleClick}
                      {...rest}>
            {children}
        </ClickableDiv>
    )
}
