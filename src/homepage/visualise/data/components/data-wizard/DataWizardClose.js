// @flow

import * as React from 'react';

import {ClickableDiv} from '../../../../lib/components/Clickable';

type DataWizardCloseProps = {
    toggleDataWizard: () => void,
}

export default function DataWizardClose(props: DataWizardCloseProps) {
    const {toggleDataWizard} = props;

    return (
        <ClickableDiv id="data-wizard-close"
                      title="Abort without saving"
                      action={toggleDataWizard}>
            <i className="material-icons data-wizard-close-i">close</i>
        </ClickableDiv>
    )
}
