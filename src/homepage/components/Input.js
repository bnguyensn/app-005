// @flow

import * as React from 'react';

type InputProps = {
    name: string,
    labelText: string,
    handleChange?: (e: SyntheticInputEvent<HTMLInputElement>) => void,
}

export default class Input extends React.PureComponent<InputProps, {}> {
    handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const {handleChange} = this.props;
        if (handleChange) {
            handleChange(e);
        }
    };

    render() {
        const {name, labelText, handleChange, ...props} = this.props;

        return (
            <div className="input-container">
                <label htmlFor={name}>
                    <span>{labelText}</span>
                    <input name={name} {...props} onChange={this.handleChange} />
                </label>
            </div>
        )
    }
}
