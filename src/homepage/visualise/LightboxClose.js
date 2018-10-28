// @flow

import * as React from 'react';

import {ClickableDiv} from '../lib/components/Clickable';

type LightboxCloseProps = {
    toggle: () => void,
}

export default function LightboxClose(props: LightboxCloseProps) {
    const {toggle} = props;

    return (
        <ClickableDiv className="lightbox-close"
                      title="Close"
                      action={toggle}>
            <i className="material-icons">close</i>
        </ClickableDiv>
    )
}
