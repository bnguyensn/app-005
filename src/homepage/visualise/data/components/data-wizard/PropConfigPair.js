// @flow

import * as React from 'react';

type DisplayPropConfigPairProps = {
    label: string,
    type: 'text' | 'number',
    name: string,
    placeholder: string,
    value: string,
    handleChange: (name: string, value: string) => void,
};

export function DisplayPropConfigPair(props: DisplayPropConfigPairProps) {
    const {label, type, name, placeholder, value, handleChange} = props;

    const change = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const t = e.currentTarget;
        const {name, value} = t;

        handleChange(name, value);
    };

    return (
        <label className="display-prop-config-pair">
            <div>{label}</div>
            <input type="text"
                   name={name}
                   placeholder={placeholder}
                   value={value}
                   onChange={change} />
        </label>
    )
}
