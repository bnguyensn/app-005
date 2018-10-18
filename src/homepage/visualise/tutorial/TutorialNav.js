// @flow

import * as React from 'react';

import TutorialNavButton from './TutorialNavButton';

import type {Stage} from '../stages/createStage';

type TutorialNavProps = {
    stages: Stage[],
    curStage: number,

    changeState: (string, any) => void,
};

export default class TutorialNav
    extends React.PureComponent<TutorialNavProps, {}> {
    render() {
        const {stages, curStage, changeState} = this.props;

        const buttons = stages.map((stage, index) => (
            <TutorialNavButton key={index}
                               stageId={index}
                               active={curStage === index}
                               changeState={changeState} />
        ));

        return (
            <div id="tutorial-nav">
                {buttons}
            </div>
        )
    }
}
