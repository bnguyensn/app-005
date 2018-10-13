// @flow

import * as React from 'react';

import getDisplayName from '../../lib/getDisplayName';

type withPanningEventsProps = {
    id: number,
    moveX: (id: number, moveDistX: number) => void;
}

type WithPanningEventsProps = {
    onMouseClick: (e: SyntheticMouseEvent<HTMLElement>) => void,
    onMouseDown: (e: SyntheticMouseEvent<HTMLElement>) => void,
    onMouseUp: (e: SyntheticMouseEvent<HTMLElement>) => void,
    onMouseEnter: (e: SyntheticMouseEvent<HTMLElement>) => void,
    onMouseLeave: (e: SyntheticMouseEvent<HTMLElement>) => void,
    onMouseMove: (e: SyntheticMouseEvent<HTMLElement>) => void,
    style: {}
}

/**
 * A component with panning events will "move" on mouse drag via the CSS
 * transform: translate(X, Y) property
 *
 * Note: currently only X movements are implemented
 * */
export default function withPanningEvents<C: React.ComponentType<{}>>(
    WrappedComponent: C,
): React.ComponentType<{}> {
    class WithPanningEvents extends React.PureComponent<withPanningEventsProps, {}> {
        mouseDown: boolean;
        mouseXY: {x: number, y: number};
        throttling: boolean;

        constructor(props: withPanningEventsProps) {
            super(props);
            this.mouseDown = false;
            this.mouseXY = {
                x: 0,
                y: 0,
            };
            this.throttling = false;
        }

        // $FlowFixMe
        handleClick = (e: SyntheticMouseEvent<HTMLElement>) => {

        };

        // $FlowFixMe
        handleMouseDown = (e: SyntheticMouseEvent<HTMLElement>) => {
            e.stopPropagation();

            const {clientX, clientY} = e;

            this.mouseDown = true;
            this.mouseXY.x = clientX;
            this.mouseXY.y = clientY;

            const rootEl = document.getElementById('root');
            if (rootEl) {
                rootEl.addEventListener('mousemove', this.handleMouseMove);
                rootEl.addEventListener('mouseup', this.handleMouseUp);
            }
        };

        // $FlowFixMe
        handleMouseUp = (e: SyntheticMouseEvent<HTMLElement>) => {
            e.stopPropagation();

            this.mouseDown = false;

            const rootEl = document.getElementById('root');
            if (rootEl) {
                rootEl.removeEventListener('mousemove', this.handleMouseMove);
                rootEl.removeEventListener('mouseup', this.handleMouseUp);
            }
        };

        // $FlowFixMe
        handleMouseEnter = (e: SyntheticMouseEvent<HTMLElement>) => {
            e.stopPropagation();

            /*const {clientX, clientY} = e;

            this.mouseXY.x = clientX;
            this.mouseXY.y = clientY;*/
        };

        // $FlowFixMe
        handleMouseLeave = (e: SyntheticMouseEvent<HTMLElement>) => {

        };

        // $FlowFixMe
        handleMouseMove = (e: SyntheticMouseEvent<HTMLElement>) => {
            e.stopPropagation();

            const {id, moveX} = this.props;
            const {clientX, clientY, currentTarget} = e;

            const moveDistX = clientX - this.mouseXY.x;

            if (this.mouseDown && currentTarget && moveDistX && !this.throttling) {
                moveX(id, moveDistX);
            }

            this.mouseXY.x = clientX;
            this.mouseXY.y = clientY;
        };

        // $FlowFixMe
        handleTouchStart = (e: SyntheticTouchEvent<HTMLElement>) => {
            e.stopPropagation();

            const {clientX, clientY} = e.touches[0];

            this.mouseDown = true;
            this.mouseXY.x = clientX;
            this.mouseXY.y = clientY;

            const rootEl = document.getElementById('root');
            if (rootEl) {
                rootEl.addEventListener('touchmove', this.handleTouchMove);
                rootEl.addEventListener('touchend', this.handleTouchEnd);
            }
        };

        // $FlowFixMe
        handleTouchEnd = (e: SyntheticTouchEvent<HTMLElement>) => {
            e.preventDefault();
            e.stopPropagation();

            this.mouseDown = false;

            const rootEl = document.getElementById('root');
            if (rootEl) {
                rootEl.removeEventListener('touchmove', this.handleTouchMove);
                rootEl.removeEventListener('touchend', this.handleTouchEnd);
            }
        };

        // $FlowFixMe
        handleTouchMove = (e: SyntheticTouchEvent<HTMLElement>) => {
            e.preventDefault();
            e.stopPropagation();

            const {id, moveX} = this.props;
            const {clientX, clientY} = e.touches[0];

            const moveDistX = clientX - this.mouseXY.x;

            if (this.mouseDown && moveDistX && !this.throttling) {
                moveX(id, moveDistX);
            }

            this.mouseXY.x = clientX;
            this.mouseXY.y = clientY;
        };

        // $FlowFixMe
        handleTouchCancel = (e: SyntheticTouchEvent<HTMLElement>) => {
            e.preventDefault();
        };

        // $FlowFixMe
        handleDrag = (e: SyntheticTouchEvent<HTMLElement>) => {
            e.preventDefault();
        };

        render() {
            const {id, moveX, ...props} = this.props;

            return (
                <WrappedComponent onClick={this.handleClick}
                                  onMouseDown={this.handleMouseDown}
                                  onMouseEnter={this.handleMouseEnter}
                                  onMouseLeave={this.handleMouseLeave}
                                  onTouchStart={this.handleTouchStart}
                                  onDrag={this.handleDrag}
                                  {...props} />
            )
        }
    }

    WithPanningEvents.displayName = `WithPanningEvents(${getDisplayName(WrappedComponent)})`;

    // $FlowFixMe
    return WithPanningEvents
}
