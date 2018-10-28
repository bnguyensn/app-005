// @flow

import * as React from 'react';
import {ClickableDiv} from '../lib/components/Clickable';

type LightboxProps = {
    show: boolean,
    content: number,
    toggleLightbox?: () => void,
    children: ?React.Node,
}

export default function Lightbox(props: LightboxProps) {
    const {show, content, toggleLightbox, children} = props;

    const handleClick = (e) => {
        e.stopPropagation();

        if (toggleLightbox) toggleLightbox(content);
    };

    return (
        <ClickableDiv className={`lightbox ${show ? 'show' : 'hide'}`}
                      action={handleClick}>
            {children}
        </ClickableDiv>
    )
}
