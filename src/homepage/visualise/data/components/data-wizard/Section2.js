// @flow

import * as React from 'react';

import type {DisplayConfig} from '../../Types';
import {DisplayPropConfigPair} from './PropConfigPair';

type Section2Props = {
    name: string,
    collapsed: boolean,
    displayConfig: DisplayConfig,
    updateDisplayConfig: (name: string, value: string) => void,
    toggleSection: (string) => void,
};

export default class Section2 extends React.PureComponent<Section2Props, {}> {
    toggleSection = (e) => {
        const {name, toggleSection} = this.props;

        toggleSection(name);
    };

    render() {
        const {collapsed, displayConfig, updateDisplayConfig} = this.props;

        const collapsibleCls = `collapsible ${collapsed ? 'collapsed' : ''}`;

        return (
            <section id="data-wizard-s2" className="data-wizard-s">
                <div className="title">
                    2. Configure display properties (optional)
                </div>
                <div className={collapsibleCls}>
                    <div className="data-wizard-s-part">
                        <div className="description">
                            The configurations below do not affect how the{' '}
                            diagram is created, but rather how it&rsquo;s{' '}
                            labelled.
                            <br /><br />
                            Blank values are accepted.
                        </div>
                    </div>
                    <div className="data-wizard-s-part">
                        <div className="display-prop-config">
                            <DisplayPropConfigPair label="Outflows label"
                                                   type="text"
                                                   name="normal"
                                                   placeholder="e.g. exports"
                                                   value={displayConfig
                                                       .dataTypeLabels.normal}
                                                   handleChange={
                                                       updateDisplayConfig} />
                            <DisplayPropConfigPair label="Inflows label"
                                                   type="text"
                                                   name="transpose"
                                                   placeholder="e.g. imports"
                                                   value={displayConfig
                                                       .dataTypeLabels
                                                       .transpose}
                                                   handleChange={
                                                       updateDisplayConfig} />
                            <DisplayPropConfigPair label="Entity label"
                                                   type="text"
                                                   name="entityLabel"
                                                   placeholder="e.g. country"
                                                   value={displayConfig
                                                       .entityLabel}
                                                   handleChange={
                                                       updateDisplayConfig} />
                            <DisplayPropConfigPair label="Transaction label"
                                                   type="text"
                                                   name="transactionLabel"
                                                   placeholder="e.g. trade"
                                                   value={displayConfig
                                                       .transactionLabel}
                                                   handleChange={
                                                       updateDisplayConfig} />
                            <DisplayPropConfigPair label="Amount prefix"
                                                   type="text"
                                                   name="amtPrefix"
                                                   placeholder="e.g. $"
                                                   value={displayConfig
                                                       .amtPrefix}
                                                   handleChange={
                                                       updateDisplayConfig} />
                            <DisplayPropConfigPair label="Amount suffix"
                                                   type="text"
                                                   name="amtSuffix"
                                                   placeholder="e.g. bn"
                                                   value={displayConfig
                                                       .amtSuffix}
                                                   handleChange={
                                                       updateDisplayConfig} />
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}
