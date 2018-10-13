// @flow

import * as React from 'react';

type ClickableProps = {
    action: (e: SyntheticMouseEvent<HTMLElement>
        | SyntheticKeyboardEvent<HTMLElement>) => void,
    children?: React.Node,
}

export function ClickableSpan(props: ClickableProps) {
    const {children, action, ...rest} = props;

    const click = (e: SyntheticMouseEvent<HTMLSpanElement>) => {
        action(e);
    };

    const keyPress = (e: SyntheticMouseEvent<HTMLSpanElement>) => {
        if (e.key === 'enter') {
            action(e);
        }
    };

    return (
        <span role="button"
              tabIndex={0}
              onClick={click}
              onKeyPress={keyPress}
              {...rest}>
            {children}
        </span>
    )
}

export function ClickableDiv(props) {
    const {children, action, ...rest} = props;

    const click = (e: SyntheticMouseEvent<HTMLSpanElement>) => {
        action(e);
    };

    const keyPress = (e: SyntheticMouseEvent<HTMLSpanElement>) => {
        if (e.key === 'enter') {
            action(e);
        }
    };

    return (
        <div role="button"
              tabIndex={0}
              onClick={click}
              onKeyPress={keyPress}
              {...rest}>
            {children}
        </div>
    )
}
