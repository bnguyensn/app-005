// @flow

import * as React from 'react';

import {DisplayGeneric, DisplayNumber, DisplayStageCreator} from './SubComponents';
import {formatAmount} from '../helpers';

import type {AnalyticsDisplayProps} from '../Analytics';
import {getEntityDataFromRowRank, getPairDataFromPairRank} from '../../../data/helpers';

export default function DefaultNoneHovered(props: AnalyticsDisplayProps) {
    const {
        data, nameData, colorScale,
        dataConfig, dataInfo,
        mode, stage,
        changeState,
    } = props;
    const {outflow, label} = dataConfig;
    const {dataG, rows, rowSorts, pairs} = dataInfo;

    const inOutL = outflow ? ' outflows' : ' inflows';
    const inOutTL = outflow ? ' inflows' : ' outflows';
    const labelL = label ? ` ${label}` : '';

    // Group
    const {totalGroup} = dataInfo;

    // Entity - Rank #0 in total
    const {
        eI: eLTotalI, eName: eLTotalName, eAmt: eLTotalAmt,
        eAmtP: eLTotalAmtP, eColor: eLTotalColor,
    } = getEntityDataFromRowRank(
        nameData, colorScale, rows, rowSorts, totalGroup, 'total', 0,
    );

    // Entity - Rank #last in total
    const {
        eI: eSTotalI, eName: eSTotalName, eAmt: eSTotalAmt,
        eAmtP: eSTotalAmtP, eColor: eSTotalColor,
    } = getEntityDataFromRowRank(
        nameData, colorScale, rows, rowSorts, totalGroup, 'total',
        rowSorts.total.length - 1,
    );

    // Entity - Rank #0 in total T
    const {
        eI: eLTotalTI, eName: eLTotalTName, eAmt: eLTotalTAmt,
        eAmtP: eLTotalTAmtP, eColor: eLTotalTColor,
    } = getEntityDataFromRowRank(
        nameData, colorScale, rows, rowSorts, totalGroup, 'totalT', 0,
    );

    // Entity - Rank #last in total T
    const {
        eI: eSTotalTI, eName: eSTotalTName, eAmt: eSTotalTAmt,
        eAmtP: eSTotalTAmtP, eColor: eSTotalTColor,
    } = getEntityDataFromRowRank(
        nameData, colorScale, rows, rowSorts, totalGroup, 'totalT',
        rowSorts.totalT.length - 1,
    );

    // Pair - Rank #0 in gross
    const {
        pHI: pLGrossHI, pLI: pLGrossLI, pHName: pLGrossHName,
        pLName: pLGrossLName, pHColor: pLGrossHColor, pLColor: pLGrossLColor,
        pHAmt: pLGrossHAmt, pLAmt: pLGrossLAmt, pHLAmt: pLGrossHLAmt,
        pHLAmtP: pLGrossHLAmtP,
    } = getPairDataFromPairRank(
        dataG, nameData, colorScale, pairs.gross.unique, totalGroup, 0,
    );

    // Pair - Rank #last in gross
    const {
        pHI: pSGrossHI, pLI: pSGrossLI, pHName: pSGrossHName,
        pLName: pSGrossLName, pHColor: pSGrossHColor, pLColor: pSGrossLColor,
        pHAmt: pSGrossHAmt, pLAmt: pSGrossLAmt, pHLAmt: pSGrossHLAmt,
        pHLAmtP: pSGrossHLAmtP,
    } = getPairDataFromPairRank(
        dataG, nameData, colorScale, pairs.gross.unique, totalGroup,
        pairs.gross.unique.length - 1,
    );

    return (
        <React.Fragment>
            <div className="title fade-in">
                At a glance
            </div>
            <div className="description fade-in">
                {/* ***** GROUP ***** */}

                <DisplayStageCreator data={data} hType="ALL" hValue={null}
                                     changeState={changeState}>
                    Total{labelL} of the whole group:{' '}
                    <DisplayNumber style={{fontWeight: 'bold'}}
                                   dataConfig={dataConfig}
                                   value={totalGroup} />{' '}
                    or <span style={{fontWeight: 'bold'}}>100%</span>)
                </DisplayStageCreator>

                {/* ***** ROW TOTAL ***** */}

                <br />

                <DisplayStageCreator data={data} hType="RINGS"
                                     hValue={eLTotalI}
                                     changeState={changeState}>
                    Highest total{labelL}{inOutL}:{' '}
                    <DisplayGeneric style={{
                        color: eLTotalColor,
                        fontWeight: 'bold',
                    }}
                                    value={eLTotalName} />{' '}
                    (<DisplayNumber style={{color: eLTotalColor}}
                                    dataConfig={dataConfig}
                                    value={eLTotalAmt} />{' '}
                    or <DisplayNumber style={{color: eLTotalColor}}
                                      dataConfig={dataConfig}
                                      p
                                      value={eLTotalAmtP} />{' '}
                    of total)
                </DisplayStageCreator>

                <DisplayStageCreator data={data} hType="RINGS"
                                     hValue={eSTotalI}
                                     changeState={changeState}>
                    Highest total{labelL}{inOutL}:{' '}
                    <DisplayGeneric style={{
                        color: eSTotalColor,
                        fontWeight: 'bold',
                    }}
                                    value={eSTotalName} />{' '}
                    (<DisplayNumber style={{color: eSTotalColor}}
                                    dataConfig={dataConfig}
                                    value={eSTotalAmt} />{' '}
                    or <DisplayNumber style={{color: eSTotalColor}}
                                       dataConfig={dataConfig}
                                       p
                                       value={eSTotalAmtP} />{' '}
                    of total)
                </DisplayStageCreator>

                {/* ***** ROW T TOTAL *****  */}

                <br />

                <DisplayStageCreator data={data} hType="RINGS"
                                     hValue={eLTotalTI}
                                     changeState={changeState}>
                    Highest total{labelL}{inOutL}:{' '}
                    <DisplayGeneric style={{
                        color: eLTotalTColor,
                        fontWeight: 'bold',
                    }}
                                    value={eLTotalTName} />{' '}
                    (<DisplayNumber style={{color: eLTotalTColor}}
                                    dataConfig={dataConfig}
                                    value={eLTotalTAmt} />{' '}
                    or <DisplayNumber style={{color: eLTotalTColor}}
                                       dataConfig={dataConfig}
                                       p
                                       value={eLTotalTAmtP} />{' '}
                    of total)
                </DisplayStageCreator>

                <DisplayStageCreator data={data} hType="RINGS"
                                     hValue={eSTotalTI}
                                     changeState={changeState}>
                    Highest total{labelL}{inOutL}:{' '}
                    <DisplayGeneric style={{
                        color: eSTotalTColor,
                        fontWeight: 'bold',
                    }}
                                    value={eSTotalTName} />{' '}
                    (<DisplayNumber style={{color: eSTotalTColor}}
                                    dataConfig={dataConfig}
                                    value={eSTotalTAmt} />{' '}
                    or <DisplayNumber style={{color: eSTotalTColor}}
                                       dataConfig={dataConfig}
                                       p
                                       value={eSTotalTAmtP} />{' '}
                    of total)
                </DisplayStageCreator>

                {/* ***** PAIRS GROSS *****  */}

                <br />

                <DisplayStageCreator data={data} hType="RIBBONS"
                                     hValue={[pLGrossHI, pLGrossLI]}
                                     changeState={changeState}>
                    Largest{labelL} pair:{' '}
                    <DisplayGeneric style={{
                        color: pLGrossHColor,
                        fontWeight: 'bold',
                    }}
                                    value={pLGrossHName} />{' '}
                    -{' '}
                    <DisplayGeneric style={{
                        color: pLGrossLColor,
                        fontWeight: 'bold',
                    }}
                                    value={pLGrossLName} />{' '}
                    (<DisplayNumber style={{color: pLGrossHColor}}
                                    dataConfig={dataConfig}
                                    value={pLGrossHLAmt} />{' '}
                    or <DisplayNumber style={{color: pLGrossHColor}}
                                      dataConfig={dataConfig}
                                      p
                                      value={pLGrossHLAmtP} />{' '}
                    of total)
                </DisplayStageCreator>

                <DisplayStageCreator data={data} hType="RIBBONS"
                                     hValue={[pSGrossHI, pSGrossLI]}
                                     changeState={changeState}>
                    Smallest{labelL} pair:{' '}
                    <DisplayGeneric style={{
                        color: pSGrossHColor,
                        fontWeight: 'bold',
                    }}
                                    value={pSGrossHName} />{' '}
                    -{' '}
                    <DisplayGeneric style={{
                        color: pSGrossLColor,
                        fontWeight: 'bold',
                    }}
                                    value={pSGrossLName} />{' '}
                    (<DisplayNumber style={{color: pSGrossHColor}}
                                    dataConfig={dataConfig}
                                    value={pSGrossHLAmt} />{' '}
                    or <DisplayNumber style={{color: pSGrossHColor}}
                                      dataConfig={dataConfig}
                                      p
                                      value={pLGrossHLAmtP} />{' '}
                    of total)
                </DisplayStageCreator>

                <br />

                {/* ***** FOOTNOTE *****  */}

                <div className="footnote">
                    Highlight relevant parts of the diagram by clicking the{' '}
                    sentences above.
                    <br />
                    Hover over the diagram to show different analytics.
                </div>
            </div>
        </React.Fragment>
    )
}
