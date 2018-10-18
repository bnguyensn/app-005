// @flow

import * as React from 'react';

import TutorialNav from './TutorialNav';

import type {Stage} from '../stages/createStage';

import './tutorial.css';

type TutorialProps = {
    stages: Stage[],
    curStage: number,

    changeState: (string, any) => void,
};

export default class Tutorial extends React.PureComponent<TutorialProps, {}> {
    render() {
        const {stages, curStage, changeState} = this.props;

        return (
            <div id="tutorial">
                <TutorialNav stages={stages}
                             curStage={curStage}
                             changeState={changeState} />
            </div>
        )
    }
}
