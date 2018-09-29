// @flow

import * as React from 'react';

import getDisplayName from '../utils/getDisplayName';

type WithPannningEventsStates = {
    offsetX: number,
    offsetY: number,
};

/**
 * A component with panning events will "move" on mouse drag via the CSS
 * transform: translate(X, Y) property
 *
 * Note: currently only X movements are implemented
 * */
export default function withPanningEvents<C: React.ComponentType<{}>>(WrappedComponent: C): C {
    class WithPanningEvents extends React.PureComponent<{}, WithPannningEventsStates> {
        mouseDown: boolean;
        mouseXY: {x: number, y: number};

        constructor(props: {}) {
            super(props);
            this.mouseDown = false;
            this.mouseXY = {
                x: 0,
                y: 0,
            };
            this.state = {
                offsetX: 0,
                offsetY: 0,
            };
        }

        // $FlowFixMe
        handleClick = (e: SyntheticMouseEvent<HTMLElement>) => {
            // Nothing here for now...
        };

        // $FlowFixMe
        handleMouseDown = (e: SyntheticMouseEvent<HTMLElement>) => {
            this.mouseDown = true;
        };

        // $FlowFixMe
        handleMouseUp = (e: SyntheticMouseEvent<HTMLElement>) => {
            this.mouseDown = false;
        };

        // $FlowFixMe
        handleMouseEnter = (e: SyntheticMouseEvent<HTMLElement>) => {
            const {clientX, clientY} = e;

            this.mouseXY.x = clientX;
            this.mouseXY.y = clientY;
        };

        // $FlowFixMe
        handleMouseLeave = (e: SyntheticMouseEvent<HTMLElement>) => {
            this.mouseDown = false;
        };

        // $FlowFixMe
        handleMouseMove = (e: SyntheticMouseEvent<HTMLElement>) => {
            let {offsetX} = this.state;
            const {clientX, clientY, currentTarget} = e;

            if (this.mouseDown && currentTarget) {
                offsetX += clientX - this.mouseXY.x;
                this.setState({
                    offsetX,
                });
            }

            this.mouseXY.x = clientX;
            this.mouseXY.y = clientY;
        };

        render() {
            const {offsetX, offsetY} = this.state;

            return (
                <WrappedComponent onMouseClick={this.handleClick}
                                  onMouseDown={this.handleMouseDown}
                                  onMouseUp={this.handleMouseUp}
                                  onMouseEnter={this.handleMouseEnter}
                                  onMouseLeave={this.handleMouseLeave}
                                  onMouseMove={this.handleMouseMove}
                                  style={{
                                      transform: `translate(${offsetX}, ${offsetY})`,
                                  }}
                                  {...this.props} />
            )
        }
    }

    WithPanningEvents.displayName = `WithPanningEvents(${getDisplayName(WrappedComponent)})`;

    return WithPanningEvents
}
