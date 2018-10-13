// @flow

import * as React from 'react';
import {Link} from '@reach/router';

import Page from '../app-components/Page';
import TemplateDLLink from './TemplateDLLink';
import UploadButtons from './UploadButtons';

import type {ColorData, FundData} from './DataTypes';

import './data.css';
import UploadStatus from './UploadStatus';

type DataProps = {
    setNewData: (FundData[], ColorData) => void,
};

type DataStates = {
    dataStatus: string,
    errorMsgs: ?string[],
    specialDataStatus: number,
};

export default class Data extends React.PureComponent<DataProps, DataStates> {
    constructor(props: DataProps) {
        super(props);

        this.state = {
            dataStatus: 'Ready to parse new data.',
            errorMsgs: null,
            specialDataStatus: 0,
        };
    }

    downloadDataTemplate = () => {
        console.log('Downloading data template...');  // TODO
    };

    setDataStatus = (
        dataStatus: string,
        errorMsgs?: ?string[],
        specialDataStatus?: number = 0,
    ) => {
        this.setState({
            dataStatus,
            errorMsgs,
            specialDataStatus,
        });
    };

    render() {
        const {setNewData} = this.props;
        const {dataStatus, errorMsgs, specialDataStatus} = this.state;

        return (
            <Page id="data">
                <section className="section-640">
                    <div className="title">PROVIDE DATA</div>
                    <div className="description">
                        Fund data can be provided using the{' '}
                        <span className="green"><b>green</b></span>{' '}
                        button below. Alternatively, use the {' '}
                        <span className="blue"><b>blue</b></span>{' '}
                        button to generate a random data set to{' '}
                        quickly test the application.
                        <br /><br />
                        After data has been successfully provided, head{' '}
                        over to{' '}
                        the <Link to="/visualise">VISUALISE</Link>{' '}
                        tab to view analysis.
                        <br /><br />
                        When providing own data, please use use the Excel{' '}
                        data template downloadable{' '}
                        <TemplateDLLink dl={this.downloadDataTemplate}>
                            here
                        </TemplateDLLink>.
                        The template includes guidance on acceptable data{' '}
                        and potential restrictions.
                        <br /><br />
                        <span className="size75">
                            <i>
                                <b>Note</b>: user-provided data is{' '}
                                <b>NOT</b> uploaded anywhere. The{' '}
                                application uses the browser to parse{' '}
                                data locally. There are no servers to{' '}
                                store any data from the{' '}
                                application&rsquo;s side.
                            </i>
                        </span>

                    </div>
                </section>
                <section className="section-640">
                    <UploadButtons setNewData={setNewData}
                                   setDataStatus={this.setDataStatus} />
                </section>
                <section className="section-640">
                    <UploadStatus dataStatus={dataStatus}
                                  errorMsgs={errorMsgs}
                                  specialDataStatus={specialDataStatus} />
                </section>
            </Page>
        )
    }
}
