// @flow

import * as React from 'react';

import {ClickableDiv} from '../../lib/components/Clickable';

type TutorialNavButtonProps = {
    stageId: number,
    active: boolean,

    changeState: (string, any) => void,
}

export default function TutorialNavButton(props: TutorialNavButtonProps) {
    const {stageId, active, changeState} = props;

    const handleClick = (e) => {
        changeState('curStage', stageId);
    };

    return (
        <ClickableDiv className={
            `tutorial-nav-button ${active ? 'active' : ''}`
        }
                      action={handleClick} />
    )
}
