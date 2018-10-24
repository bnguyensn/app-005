// @flow

import * as React from 'react';

import Page from '../components/Page';
import OpenDataWizard from './data/components/OpenDataWizard';
import DataWizard from './data/components/data-wizard/DataWizard';
import Chart from './main-chart/Chart';
import Analytics from './analytics/Analytics';
import ResetDataSet from './data/components/ResetDataSet';

import type {AppStates, SetNewDataFn} from '../App';
import type {ColorScale, DataAll, DataConfig, DisplayConfig}
    from './data/Types';
import type {SheetNames} from './data/xlsx/readWorkbook';

import './visualise.css';

type VisualiseProps = {
    ...AppStates,
    setNewData: SetNewDataFn,
    resetDataSet: () => void,
    changeState: (state: string, newState: any) => void,
    changeStates: (newStates: {}) => void,
};

type VisualiseStates = {
    dataWizardShow: boolean,
}

export default class Visualise
    extends React.PureComponent<VisualiseProps, VisualiseStates> {
    constructor(props: VisualiseProps) {
        super(props);

        this.state = {
            dataWizardShow: false,
        };
    }

    /** ********** DATA ********** **/

    toggleDataWizard = () => {
        this.setState((prevState: VisualiseStates) => ({
            dataWizardShow: !prevState.dataWizardShow,
        }));
    };

    setNewData = (
        dataAll: DataAll,
        sheetNames: SheetNames,
        colorScale: ColorScale,
        dataConfig: DataConfig,
        displayConfig: DisplayConfig,
    ) => {
        const {setNewData} = this.props;

        this.toggleDataWizard();

        setNewData(dataAll, sheetNames, colorScale, dataConfig, displayConfig);

        console.log('new data set.');  // TODO: show tooltip
    };

    abortDataWizard = () => {
        this.toggleDataWizard();

        console.log('data wizard aborted.');  // TODO: show tooltip
    };

    /** ********** RENDER ********** **/

    render() {
        const {
            dataKey,
            dataAll, sheetNames, colorScale,
            dataConfig, displayConfig,
            sizes,
            mode, stages, curStage,
            allowEvents,
            setNewData, resetDataSet, changeState, changeStates,
        } = this.props;
        const {dataWizardShow} = this.state;

        const {dataType, pairsNoSelf, sheetsOrder, curSheet} = dataConfig;
        const {dataInfo, nameData} = dataAll[sheetNames[curSheet]];

        return (
            <Page id="visualise">
                <Chart dataKey={dataKey}
                       data={dataInfo.dataExtended[dataType]}
                       nameData={nameData}
                       colorScale={colorScale}
                       size={sizes.mainChartSize}
                       mode={mode}
                       stages={stages}
                       curStage={curStage}
                       allowEvents={allowEvents}
                       changeState={changeState}
                       changeStates={changeStates} />
                <Analytics dataAll={dataAll}
                           sheetNames={sheetNames}
                           colorScale={colorScale}
                           dataConfig={dataConfig}
                           displayConfig={displayConfig}
                           mode={mode}
                           stages={stages}
                           curStage={curStage}
                           changeState={changeState} />
                <div id="data-ctn">
                    <OpenDataWizard toggleDataWizard={this.toggleDataWizard} />
                    <ResetDataSet resetDataSet={resetDataSet} />
                    <DataWizard key={dataWizardShow.toString()}
                                show={dataWizardShow}
                                dataAll={dataAll}
                                sheetNames={sheetNames}
                                colorScale={colorScale}
                                dataConfig={dataConfig}
                                displayConfig={displayConfig}
                                toggleDataWizard={this.toggleDataWizard}
                                setNewData={this.setNewData}
                                abortDataWizard={this.abortDataWizard} />
                </div>


            </Page>
        )
    }
}
