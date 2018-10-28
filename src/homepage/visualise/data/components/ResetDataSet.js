// @flow

import * as React from 'react';

import {ClickableDiv} from '../../../lib/components/Clickable';

import '../data.css';

type ResetDataSetProps = {
    resetDataSet: () => void,
};

export default function ResetDataSet(props: ResetDataSetProps) {
    const {resetDataSet} = props;

    const handleClick = (e) => {
        resetDataSet();
    };

    return (
        <ClickableDiv className="data-button red"
                      title="Reset data set to default"
                      action={handleClick}>
            RESET DATA
        </ClickableDiv>
    )
}
