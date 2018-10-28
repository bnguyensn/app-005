// @flow

import * as React from 'react';
import Page from '../components/Page';
import Title from './Title';
import Lightbox from './Lightbox';
import Info from './Info';

import CPButton from './control-panel/CPButton';
import DataWizard from './data/components/data-wizard/DataWizard';
import SwitchSheet from './control-panel/switch-sheet/SwitchSheet';

import NoData from './NoData';
import Chart from './main-chart/Chart';
import Tooltip from './tooltip/Tooltip';
import Content from './tooltip/Content';

import {createUpdatesHighlight, createUpdatesNormalHighlight}
    from './stages/createUpdates';
import {getRingsRibbonsFromRibbon, getRingsRibbonsFromRing}
    from './data/helpers/helpers';

import type {AppStates, SetNewDataFn} from '../App';
import type {ActiveItem, ColorScale, DataAll, DataConfig, DisplayConfig}
    from './data/Types';
import type {SheetNames} from './data/xlsx/readWorkbook';

import './visualise.css';
import './data/data.css';

/** ********** CONFIGS ********** **/

const ttW = 150;  // Tooltip's width in px
const ttOW = 50;  // Starting width offset of tooltip offset
const ttOH = 10;  // Starting width offset of tooltip offset

/** ********** TYPES ********** **/

type VisualiseProps = {
    ...AppStates,
    setNewData: SetNewDataFn,
    resetDataSet: () => void,
    changeState: (state: string, newState: any) => void,
    changeStates: (newStates: {}) => void,
};

type VisualiseStates = {
    mouseX: number,
    mouseY: number,
    tooltipOffsetX: number,
    tooltipOffsetY: number,
    lightboxShow: boolean,
    lightboxContent: number,
}

/** ********** MAIN ********** **/

export default class Visualise
    extends React.PureComponent<VisualiseProps, VisualiseStates> {
    constructor(props: VisualiseProps) {
        super(props);

        this.state = {
            mouseX: 0,
            mouseY: 0,
            tooltipOffsetX: 0,
            tooltipOffsetY: 0,
            lightboxShow: false,
            lightboxContent: 0,
        };
    }

    /** ********** LIGHTBOX ********** **/

    toggleLightbox = (contentId: number) => {
        this.setState((prevState: VisualiseStates) => ({
            lightboxShow: !prevState.lightboxShow,
            lightboxContent: contentId,
        }));
    };

    toggleInfo = () => {
        this.toggleLightbox(0);
    };

    toggleDataWizard = () => {
        this.toggleLightbox(1);
    };

    /** ********** CONFIGURE DATA ********** **/

    setNewData = (
        dataAll: DataAll,
        sheetNames: SheetNames,
        colorScale: ColorScale,
        dataConfig: DataConfig,
        displayConfig: DisplayConfig,
    ) => {
        const {setNewData} = this.props;

        this.toggleDataWizard();

        setNewData(
            dataAll, sheetNames, colorScale,
            dataConfig, displayConfig,
        );

        console.log('new data set.');  // TODO: show tooltip
    };

    abortDataWizard = () => {
        this.toggleDataWizard();

        console.log('data wizard aborted.');  // TODO: show tooltip
    };

    /** ********** USER INTERACTION ********** **/

    getTooltipOffset = (clientX: number, clientY: number): [number, number] => {
        const dToEdgeR = window.innerWidth - clientX;
        const dToEdgeL = clientX;
        const dToEdgeT = clientY;
        const dToEdgeB = window.innerHeight - clientY;

        // Top
        if (clientY <= window.innerHeight / 2) {
            // Left
            if (clientX <= window.innerWidth / 2) {
                if (dToEdgeL < ttW + ttOW) {
                    return [`${-dToEdgeL}px`, `calc(-50% - ${ttOH}px)`]
                }
                return [`calc(-100% - ${ttOW}px)`, `calc(-50% - ${ttOH}px)`]
            }

            // Right
            if (dToEdgeR < ttW) {
                return [`${-(ttW - dToEdgeR)}px`, `calc(-50% - ${ttOH}px)`]
            }
            return [`${ttOW}px`, `calc(-50% - ${ttOH}px)`]
        }

        // Bottom - Left
        if (clientX <= window.innerWidth / 2) {
            if (dToEdgeL < ttW + ttOW) {
                return [`${-dToEdgeL}px`, `calc(-50% - ${ttOH}px)`]
            }
            return [`calc(-100% - ${ttOW}px)`, `${ttOH}px`]
        }

        // Bottom - Right
        if (dToEdgeR < ttW) {
            return [`${-(ttW - dToEdgeR)}px`, `calc(-50% - ${ttOH}px)`]
        }
        return [`${ttOW}px`, `${ttOH}px`]
    };

    handleHover = (item: ActiveItem, clientX: number, clientY: number) => {
        const {chartData, activeItems, changeStates} = this.props;
        const chordData = chartData.cur;
        const {type, name, d} = item;

        let hRingsG, hRibbonsG, newUpdates;
        if (type === 'RIBBON') {
            [hRingsG, hRibbonsG] = getRingsRibbonsFromRibbon(
                chordData, d.source.index, d.target.index,
            );
        } else if (type === 'RING') {
            [hRingsG, hRibbonsG] = getRingsRibbonsFromRing(chordData, d.index);
        }

        if (hRingsG && hRibbonsG) {
            newUpdates = createUpdatesHighlight(hRingsG, hRibbonsG, 1, 0.75);

            // ***** End ***** //

            const [offsetX, offsetY] = this.getTooltipOffset(clientX, clientY);

            this.setState({
                mouseX: clientX,
                mouseY: clientY,
                tooltipOffsetX: offsetX,
                tooltipOffsetY: offsetY,
            });

            changeStates({
                activeItems: {
                    hovered: item,
                    clicked: {...activeItems.clicked},
                },
                updates: newUpdates,
            });
        } else {
            this.handleUnhover();
        }
    };

    handleUnhover = () => {
        const {activeItems, changeStates} = this.props;

        // ***** Calculate next update ***** //

        const newUpdates = createUpdatesNormalHighlight();

        // ***** End ***** //

        changeStates({
            activeItems: {
                hovered: null,
                clicked: {...activeItems.clicked},
            },
            updates: newUpdates,
        });
    };

    /** ********** RENDER ********** **/

    render() {
        const {
            dataKey,
            dataAll, sheetNames, colorScale,
            chartData,
            dataConfig, displayConfig,
            sizes,
            activeItems, updates,
            allowEvents,
            setNewData, resetDataSet, changeState, changeStates,
        } = this.props;
        const {
            mouseX, mouseY, tooltipOffsetX, tooltipOffsetY,
            lightboxShow, lightboxContent,
        } = this.state;

        const {
            dataType, pairsNoSelf, sheetsOrder, curSheet, prevSheet,
        } = dataConfig;

        const {dataInfo, nameData} = dataAll
            ? dataAll[sheetNames[curSheet]]
            : {dataInfo: null, nameData: null};

        return (

            <Page id="visualise">
                <Title />
                {dataAll
                    ? (
                        <Chart dataKey={dataKey}
                               chordData={chartData.cur}
                               nameData={nameData}
                               colorScale={colorScale}
                               dataConfig={dataConfig}
                               size={sizes.mainChartSize}
                               updates={updates}
                               allowEvents={allowEvents}
                               handleHover={this.handleHover}
                               handleUnhover={this.handleUnhover}
                               changeState={changeState}
                               changeStates={changeStates} />
                    )
                    : <NoData />}
                {/*<Analytics dataAll={dataAll}
                           sheetNames={sheetNames}
                           colorScale={colorScale}
                           dataConfig={dataConfig}
                           displayConfig={displayConfig}
                           mode={mode}
                           stages={stages}
                           curStage={curStage}
                           changeState={changeState} />*/}
                <div id="cp-top">
                    <CPButton icon="info"
                              title="Info"
                              action={this.toggleInfo} />
                    <CPButton icon="data_usage"
                              title="Configure data"
                              action={this.toggleDataWizard} />
                </div>
                <div id="cp-bot">
                    {dataAll
                        ? (
                            <SwitchSheet dataAll={dataAll}
                                         sheetNames={sheetNames}
                                         colorScale={colorScale}
                                         chartData={chartData}
                                         dataConfig={dataConfig}
                                         size={sizes.mainChartSize}
                                         changeStates={changeStates} />
                        )
                        : null}
                </div>
                {activeItems.hovered
                    ? (
                        <Tooltip posT={mouseY}
                                 posL={mouseX}
                                 posOffsetX={tooltipOffsetX}
                                 posOffsetY={tooltipOffsetY}>
                            <Content activeItem={activeItems.hovered}
                                     dataAll={dataAll}
                                     sheetNames={sheetNames}
                                     colorScale={colorScale}
                                     dataConfig={dataConfig}
                                     displayConfig={displayConfig} />
                        </Tooltip>
                    )
                    : null
                }
                <Lightbox show={lightboxShow}
                          content={lightboxContent}
                          toggleLightbox={this.toggleLightbox}>
                    {lightboxContent === 0
                        ? <Info toggle={this.toggleInfo} />
                        : lightboxContent === 1
                            ? (
                                <DataWizard key={lightboxShow.toString()}
                                            dataAll={dataAll}
                                            sheetNames={sheetNames}
                                            colorScale={colorScale}
                                            dataConfig={dataConfig}
                                            displayConfig={displayConfig}
                                            toggle={this.toggleDataWizard}
                                            setNewData={this.setNewData}
                                            abortDataWizard={this.abortDataWizard} />
                            )
                            : null
                    }
                </Lightbox>
            </Page>
        )
    }
}
