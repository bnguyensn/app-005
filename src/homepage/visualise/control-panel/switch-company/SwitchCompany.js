// @flow

import * as React from 'react';

import './switch-company.css';

type SwitchCompanyProps = {
    companyNames: string[],
    curCompany: string,
    switchCompany: (newCurCompany: string) => void,
}

export default class SwitchCompany
    extends React.PureComponent<SwitchCompanyProps, {}> {
    handleSelect = (e: SyntheticInputEvent<HTMLSelectElement>) => {
        const {switchCompany} = this.props;

        const selectedVal = e.currentTarget.value;

        switchCompany(selectedVal);
    };

    render() {
        const {companyNames, curCompany} = this.props;

        const options = companyNames.map(companyName => (
            <option key={companyName}
                    value={companyName}>
                {companyName}
            </option>
        ));

        return (
            <div id="main-chart-control-panel-switch-company">
                <label id="switch-company-label"
                       htmlFor="switch-company-select">
                    <select id="switch-company-select"
                            defaultValue={curCompany}
                            onChange={this.handleSelect}>
                        {options}
                    </select>
                </label>
            </div>
        )
    }
}
