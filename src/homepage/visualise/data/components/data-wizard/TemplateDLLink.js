// @flow

import * as React from 'react';

import {ClickableSpan} from '../../../../lib/components/Clickable';

type TemplateDLLinkProps = {
    children?: React.Node,
    dl: () => void,
};

export default function TemplateDLLink(props: TemplateDLLinkProps) {
    const {children, dl} = props;

    return (
        <ClickableSpan className="fake-link"
                       action={dl}>
            {children}
        </ClickableSpan>
    )
}
