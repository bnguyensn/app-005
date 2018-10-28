// @flow

import * as React from 'react';

import {ClickableDiv} from '../../lib/components/Clickable';

import './cp.css';

type CPButtonProps = {
    icon: string,
    title: string,
    action: () => void,
};

type CPButtonStates = {};

export default class CPButton
    extends React.PureComponent<CPButtonProps, CPButtonStates> {
    render() {
        const {icon, title, action} = this.props;

        return (
            <ClickableDiv className="cp-button"
                          title={title}
                          action={action}>
                <div className="cp-button-title">{title}</div>
                <i className="material-icons">{icon}</i>
            </ClickableDiv>
        )
    }
}