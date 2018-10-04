// @flow

import * as React from 'react';

const withButtonARIA = (WrappedComponent: any) => (props: any) => {
    const {handleClick, ...rest} = props;

    const handleKeyPress = (e: SyntheticKeyboardEvent<HTMLElement>) => {
        if (e.key === 'enter') {

        }
    };

    return (
        <WrappedComponent {...rest}
                          role="button" tabIndex={0}
                          onKeyPress={handleKeyPress} />
    )
};

export default withButtonARIA
