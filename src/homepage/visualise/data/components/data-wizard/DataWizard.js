// @flow

import * as React from 'react';

import Section1 from './Section1';
import Section2 from './Section2';
import DataWizardClose from './DataWizardClose';
import createColorScale from '../../../main-chart/chart-funcs/createColorScale';
import {ClickableDiv} from '../../../../lib/components/Clickable';

import type {
    ColorData, ColorScale, DataAll, DataConfig, DataType, DisplayConfig,
    NameData,
} from '../../Types';
import type {SetNewDataFn} from '../../../../App';
import type {SheetNames} from '../../xlsx/readWorkbook';

import './data-wizard.css';

const dataTypes: DataType = ['normal', 'transpose', 'net', 'gross'];

type DataWizardProps = {
    show: boolean,

    dataAll: DataAll,
    sheetNames: SheetNames,
    colorScale: ColorScale,
    dataConfig: DataConfig,
    displayConfig: DisplayConfig,

    toggleDataWizard: () => void,
    setNewData: SetNewDataFn,
    abortDataWizard: () => void,
};

type DataWizardStates = {
    dataAll: DataAll,
    sheetNames: SheetNames,
    colorScale: ColorScale,
    dataConfig: DataConfig,
    displayConfig: DisplayConfig,

    sectionCollapse: {[key: string]: boolean},  // TODO: currently not in use
};

/**
 * This component resets on props.show changes
 * */
export default class DataWizard
    extends React.PureComponent<DataWizardProps, DataWizardStates> {
    constructor(props: DataWizardProps) {
        super(props);

        const {
            dataAll, sheetNames, colorScale, dataConfig, displayConfig,
        } = props;

        this.state = {
            dataAll,
            sheetNames,
            colorScale,
            dataConfig,
            displayConfig,
            sectionCollapse: {
                '1': false,
                '2': false,
            },
        };
    }

    /** ***** Update everything (final button) ***** **/

    setNewData = () => {
        const {setNewData} = this.props;
        const {
            dataAll, sheetNames, colorScale, dataConfig, displayConfig,
        } = this.state;

        // This is the last setNewData(), which updates AppStates with
        // the data information residing in this.state;
        setNewData(dataAll, sheetNames, colorScale, dataConfig, displayConfig);
    };

    /** ***** Update parts - Ensure all passed objects are NEW ***** **/

    updateDataSet = (dataAll: DataAll, sheetNames: SheetNames) => {
        this.setState({
            dataAll,
            sheetNames,
        });
    };

    updateColorScale = (colorData: ColorData) => {
        this.setState({
            colorScale: createColorScale(colorData),
        });
    };

    updateDisplayConfig = (
        configName: string,
        configValue: string,
    ) => {
        const {displayConfig} = this.state;

        const newConfig = JSON.parse(JSON.stringify(displayConfig));

        if (dataTypes.includes(configName)) {
            newConfig.dataTypeLabels[configName] = configValue;
        } else {
            newConfig[configName] = configValue;
        }

        this.setState({
            displayConfig: newConfig,
        });
    };

    /** ***** Component functionality ***** **/

    backgroundClick = (e) => {
        const {toggleDataWizard} = this.props;

        e.stopPropagation();

        toggleDataWizard();
    };

    dataWizardClick = (e) => {
        e.stopPropagation();
    };

    toggleSection = (section: string) => {
        this.setState((prevState: DataWizardStates) => ({
            sectionCollapse: {
                ...prevState.sectionCollapse,
                [section]: !prevState.sectionCollapse[section],
            },
        }));
    };

    /** ***** Main ***** **/

    render() {
        const {show, toggleDataWizard, abortDataWizard} = this.props;
        const {dataConfig, displayConfig, sectionCollapse} = this.state;

        const bkgCls = `data-wizard-background ${show ? 'show' : 'hide'}`;
        const dwCls = `${show ? 'show' : 'hide'}`;

        return (
            <ClickableDiv className={bkgCls}
                          action={this.backgroundClick}>
                <ClickableDiv id="data-wizard"
                              className={dwCls}
                              action={this.dataWizardClick}>
                    <DataWizardClose toggleDataWizard={toggleDataWizard} />
                    <div className="title">
                        DATA WIZARD
                    </div>
                    <Section1 name="1"
                              collapsed={sectionCollapse['1']}
                              dataConfig={dataConfig}
                              updateDataSet={this.updateDataSet}
                              updateDataConfig={this.updateDataConfig}
                              toggleSection={this.toggleSection}
                              setNewData={this.setNewData}
                              abortDataWizard={abortDataWizard} />
                    <Section2 name="2"
                              collapsed={sectionCollapse['2']}
                              displayConfig={displayConfig}
                              updateDisplayConfig={this.updateDisplayConfig}
                              toggleSection={this.toggleSection} />
                </ClickableDiv>
            </ClickableDiv>
        )
    }
}
