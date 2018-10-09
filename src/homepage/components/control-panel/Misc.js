// @flow

import * as React from 'react';

export type MiscCheckboxes = {
    weightedAssets: boolean,
};

type MiscProps = {
    miscCheckboxes: MiscCheckboxes,
    changeCheckbox: (name: string) => void,
};

export default class Misc extends React.PureComponent<MiscProps, {}> {
    handleCheckboxChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const {changeCheckbox} = this.props;

        changeCheckbox(e.target.name);
    };

    render() {
        const {miscCheckboxes} = this.props;

        return (
            <div className="cp-misc cp-subsection-320">
                <div className="title"
                     draggable={false}>
                    MISC.
                </div>
                <div className="description"
                     draggable={false}>
                    Customise data using the options below
                </div>

                <div className="cp-misc-checkboxes cp-subsection-320">
                    <label>
                        <input type="checkbox"
                               name="weightedAssets"
                               checked={miscCheckboxes.weightedAssets}
                               onChange={this.handleCheckboxChange} />
                        Use weighted assets
                    </label>
                </div>
            </div>
        )
    }
}
