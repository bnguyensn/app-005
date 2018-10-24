// @flow

import * as React from 'react';

type ClickableProps = {
    action: (e: SyntheticMouseEvent<HTMLElement>
        | SyntheticKeyboardEvent<HTMLElement>) => void,
    capture?: boolean,
    children?: React.Node,
}

export function ClickableSpan(props: ClickableProps) {
    const {children, action, capture, ...rest} = props;

    const click = (e: SyntheticMouseEvent<HTMLSpanElement>) => {
        if (action) action(e);
    };

    const keyPress = (e: SyntheticMouseEvent<HTMLSpanElement>) => {
        if (e.key === 'enter' && action) {
            action(e);
        }
    };

    return (
        <span role="button"
              tabIndex={0}
              onClick={capture ? null : click}
              onClickCapture={capture ? click : null}
              onKeyPress={capture ? null : keyPress}
              onKeyPressCapture={capture ? keyPress : null}
              {...rest}>
            {children}
        </span>
    )
}

export function ClickableDiv(props) {
    const {children, action, capture, ...rest} = props;

    const click = (e: SyntheticMouseEvent<HTMLSpanElement>) => {
        if (action) action(e);
    };

    const keyPress = (e: SyntheticMouseEvent<HTMLSpanElement>) => {
        if (e.key === 'enter' && action) {
            action(e);
        }
    };

    return (
        <div role="button"
             tabIndex={0}
             onClick={capture ? null : click}
             onClickCapture={capture ? click : null}
             onKeyPress={capture ? null : keyPress}
             onKeyPressCapture={capture ? keyPress : null}
             {...rest}>
            {children}
        </div>
    )
}
