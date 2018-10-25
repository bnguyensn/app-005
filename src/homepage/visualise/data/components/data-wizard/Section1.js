// @flow

import * as React from 'react';

import SelectDataSet from './SelectDataSet';
import {ClickableDiv} from '../../../../lib/components/Clickable';

import type {DataAll, DataConfig} from '../../Types';
import type {SheetNames} from '../../xlsx/readWorkbook';
import type {ErrMsgs} from './SelectDataSet';
import type {SetNewDataFn} from '../../../../App';

/** ********** CONFIGS ********** **/

const tDLURL = '/downloadtemplate';

const statusMapper = {
    '0': 'Ready to receive data',
    '1': 'Parsing data...',
    '2': 'Data parsed successfully',
    '5': 'Error parsing data',
};

/** ********** TYPES ********** **/

type Section1Props = {
    name: string,
    collapsed: boolean,
    dataConfig: DataConfig,
    updateDataSet: (DataAll, SheetNames) => void,
    updateDataConfig: (DataConfig) => void,
    toggleSection: (string) => void,
    setNewData: SetNewDataFn,
    abortDataWizard: () => void,
};

type Section1States = {
    dataStatus: number,
    dataErrMsgs: ErrMsgs,
};

/** ********** MAIN ********** **/

export default class Section1
    extends React.PureComponent<Section1Props, Section1States> {
    constructor(props: {}) {
        super(props);

        this.state = {
            dataStatus: 0,
            dataErrMsgs: [],
        };
    }

    setDataStatus = (dataStatus: number, dataErrMsgs?: ErrMsgs = []) => {
        this.setState({
            dataStatus,
            dataErrMsgs,
        });
    };

    toggleSection = (e) => {
        const {name, toggleSection} = this.props;

        toggleSection(name);
    };

    render() {
        const {
            collapsed, dataConfig, updateDataSet, updateDataConfig,
            setNewData, abortDataWizard,
        } = this.props;
        const {dataStatus, dataErrMsgs} = this.state;

        const collapsibleCls = `collapsible ${collapsed ? 'collapsed' : ''}`;

        const dataStatusMsg = statusMapper[dataStatus];

        const dataErrMsgsC = dataStatus === 0
            ? '---'
            : dataErrMsgs.length > 0
                ? dataErrMsgs.map(m => <div key={m}>{m}</div>)
                : <div>No errors</div>;

        const confirmBtnDisabled = dataStatus === 1 || dataStatus === 5;
        const confirmBtnCls = 'data-button '
            + `${confirmBtnDisabled ? 'disabled' : 'blue'}`;
        const confirmBtnAction = confirmBtnDisabled ? null : setNewData;
        const confirmBtnTitle = confirmBtnDisabled
            ? 'Can only confirm new data if there are no parsing errors'
            : 'Close the wizard with newly updated data';

        return (
            <section id="data-wizard-s1" className="data-wizard-s">
                <div className="title">
                    1. Select data set
                </div>
                <div className={collapsibleCls}>
                    <div className="data-wizard-s-part">
                        <div className="description">
                            Select new data set with the{' '}
                            <span className="green-txt">green</span>{' '}
                            button. Data set can be any valid Excel{' '}
                            spreadsheet resembling an n x n (n &gt;&#61; 2){' '}
                            matrix.
                            <br /><br />
                            Template data set coming in the next version.
                            <br /><br />
                            At its current version, the wizard{' '}
                            assumes your spreadsheet rows to contain{' '}
                            outflows and columns to contain inflows data.
                        </div>
                        <div>
                            <SelectDataSet dataConfig={dataConfig}
                                           updateDataSet={updateDataSet}
                                           setDataStatus={this.setDataStatus} />
                        </div>
                    </div>
                    <div className="data-wizard-s-part">
                        <div id="upload-status"
                             className={`status-${dataStatus}`}>
                            {dataStatusMsg}
                        </div>
                    </div>
                    <div className="data-wizard-s-part">
                        <div id="upload-errors"
                             className={`status-${dataStatus}`}>
                            {dataErrMsgsC}
                        </div>
                    </div>
                    <div className="data-wizard-s-part">
                        <div className="description">
                            If there are no parsing errors after selecting{' '}
                            the new data set, use the{' '}
                            <span className="blue-txt">blue</span> button{' '}
                            to exit and see your new diagram.
                            <br /><br />
                            Alternatively, use the{' '}
                            <span className="red-txt">red</span> button{' '}
                            to abort the process without saving anything.
                        </div>
                    </div>
                    <div className="data-wizard-s-part">
                        <ClickableDiv className={confirmBtnCls}
                                      title={confirmBtnTitle}
                                      action={confirmBtnAction}>
                            CONFIRM & CLOSE
                        </ClickableDiv>
                        <ClickableDiv className="data-button red"
                                      title={'Abort the wizard without saving '
                                      + 'anything'}
                                      action={abortDataWizard}>
                            ABORT WITHOUT SAVING
                        </ClickableDiv>
                    </div>
                </div>
            </section>
        )
    }
}
