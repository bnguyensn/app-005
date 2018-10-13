// @flow

import * as React from 'react';

import './page.css';

export default function Page(props: {children?: React.Node}) {
    const {children} = props;

    return (
        <div className="page" {...props}>
            {children}
        </div>
    )
}
