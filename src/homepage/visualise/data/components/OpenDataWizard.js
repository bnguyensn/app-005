// @flow

import * as React from 'react';

import {ClickableDiv} from '../../../lib/components/Clickable';

import '../data.css';

type OpenDataWizardProps = {
    toggleDataWizard: () => void,
};

export default function OpenDataWizard(props: OpenDataWizardProps) {
    const {toggleDataWizard} = props;

    const handleClick = (e) => {
        toggleDataWizard();
    };

    return (
        <ClickableDiv className="data-button green"
                      title="Open the data wizard"
                      action={handleClick}>
            CONFIGURE DATA
        </ClickableDiv>
    )
}
