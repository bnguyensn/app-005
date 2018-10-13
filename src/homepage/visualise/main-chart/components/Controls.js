// @flow

import * as React from 'react';

import ControlsButton from './ControlsButton';

import './controls.css';

type ControlsProps = {
    pannablePosReset: () => void,
}

export default function Controls(props: ControlsProps) {
    const {pannablePosReset} = props;

    return (
        <div id="main-chart-controls">
            <ControlsButton title="Reset chart position"
                            action={pannablePosReset}>
                R
            </ControlsButton>
        </div>
    )
}
