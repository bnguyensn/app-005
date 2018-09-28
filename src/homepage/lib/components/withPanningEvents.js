// @flow

import * as React from 'react';

/**
 * A component with panning events will "move" on mouse drag via the CSS
 * transform: translate(X, Y) property
 * */
export default function withPanningEvents(WrappedComponent, data) {
    return class extends React.PureComponent<{}, {}> {


        render() {
            const {props} = this.props;

            return <WrappedComponent {...props} />
        }
    }
};
