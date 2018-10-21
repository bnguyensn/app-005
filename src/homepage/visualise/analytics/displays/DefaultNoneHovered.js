// @flow

import * as React from 'react';

import {ADNam, ADNum, ADStagerHLAll, ADStagerHLRings, ADStagerHLRibbons}
    from './SubComponents';

import type {AnalyticsDisplayProps} from '../Analytics';
import {
    getEntityIdFromRankAll, getPairIdsFromPairName,
    getPairNameFromRankPairs,
} from '../../../data/helpers';

export default function DefaultNoneHovered(props: AnalyticsDisplayProps) {
    const {
        data, nameData, colorScale,
        dataConfig, dataInfo, displayConfig,
        mode, stage,
        changeState,
    } = props;
    const {dataType, pairsNoSelf} = dataConfig;
    const {dataExtended, entities} = dataInfo;
    const {dataTypeLabels, entityLabel, transactionLabel} = displayConfig;

    const dataTypeLabel = dataTypeLabels[dataType];
    const transactionLabelAdj = transactionLabel ? ` ${transactionLabel}` : '';

    // Group
    const {totalGroup} = dataInfo;

    // Entity - Ranks All Highest (eRAH)
    const eRAHId = getEntityIdFromRankAll(dataInfo, 0, dataType);
    const eRAHMName = nameData[eRAHId];
    const eRAHColor = colorScale(eRAHId);
    const eRAHAmt = entities[eRAHId].totals[dataType];
    const eRAHAmtP = eRAHAmt / totalGroup[dataType];

    // Entity - Ranks All Lowest (eRAL)
    const eRALId = getEntityIdFromRankAll(dataInfo, 'LAST', dataType);
    const eRALMName = nameData[eRALId];
    const eRALColor = colorScale(eRALId);
    const eRALAmt = entities[eRALId].totals[dataType];
    const eRALAmtP = eRALAmt / totalGroup[dataType];

    // Pair - Ranks Highest (pRNSH)
    const pRNSHName = getPairNameFromRankPairs(
        dataInfo, 0, 'gross', pairsNoSelf,
    );
    const [pRNSHIdA, pRNSHIdB] = getPairIdsFromPairName(pRNSHName);
    const pRNSHNameA = nameData[pRNSHIdA];
    const pRNSHColorA = colorScale(pRNSHIdA);
    const pRNSHNameB = nameData[pRNSHIdB];
    const pRNSHColorB = colorScale(pRNSHIdB);
    const pRNSHAmtA = dataExtended[dataType][pRNSHIdA][pRNSHIdB];
    const pRNSHAmtB = dataExtended[dataType][pRNSHIdB][pRNSHIdA];
    const pRNSHColorAB = pRNSHAmtA >= pRNSHAmtB ? pRNSHColorA : pRNSHColorB;
    const pRNSHAmtAB = pRNSHAmtA + pRNSHAmtB;
    const pRNSHAmtABP = pRNSHAmtAB / totalGroup[dataType];

    // Pair - Ranks Lowest (pRNSL)
    const pRNSLName = getPairNameFromRankPairs(
        dataInfo, 'LAST', 'gross', pairsNoSelf,
    );
    const [pRNSLIdA, pRNSLIdB] = getPairIdsFromPairName(pRNSLName);
    const pRNSLNameA = nameData[pRNSLIdA];
    const pRNSLColorA = colorScale(pRNSLIdA);
    const pRNSLNameB = nameData[pRNSLIdB];
    const pRNSLColorB = colorScale(pRNSLIdB);
    const pRNSLAmtA = dataExtended[dataType][pRNSLIdA][pRNSLIdB];
    const pRNSLAmtB = dataExtended[dataType][pRNSLIdB][pRNSLIdA];
    const pRNSLColorAB = pRNSLAmtA >= pRNSLAmtB ? pRNSLColorA : pRNSLColorB;
    const pRNSLAmtAB = pRNSLAmtA + pRNSLAmtB;
    const pRNSLAmtABP = pRNSLAmtAB / totalGroup[dataType];

    return (
        <React.Fragment>
            <div className="title fade-in">
                At a glance
            </div>
            <div className="description fade-in">
                {/* ***** GROUP ***** */}

                <ADStagerHLAll data={data}
                               changeState={changeState}>
                    Total{dataTypeLabel}{transactionLabelAdj} of the whole{' '}
                    group:{' '}
                    <ADNum style={{fontWeight: 'bold'}}
                           displayConfig={displayConfig}
                           value={totalGroup[dataType]} />{' '}
                    (<span style={{fontWeight: 'bold'}}>100%</span>)
                </ADStagerHLAll>
                <br />

                {/* ***** ENTITY RANKS ALL HIGHEST ***** */}

                <ADStagerHLRings data={data} ring={eRAHId}
                                 changeState={changeState}>
                    Highest{dataTypeLabel}{transactionLabelAdj}:{' '}
                    <ADNam style={{color: eRAHColor, fontWeight: 'bold'}}
                           value={eRAHMName} />{' '}
                    (<ADNum style={{color: eRAHColor}}
                            displayConfig={displayConfig}
                            value={eRAHAmt} /> or {' '}
                    <ADNum style={{color: eRAHColor}}
                           displayConfig={displayConfig} p
                           value={eRAHAmtP} />)
                </ADStagerHLRings>

                {/* ***** ENTITY RANKS ALL LOWEST ***** */}

                <ADStagerHLRings data={data} ring={eRALId}
                                 changeState={changeState}>
                    Lowest{dataTypeLabel}{transactionLabelAdj}:{' '}
                    <ADNam style={{color: eRALColor, fontWeight: 'bold'}}
                           value={eRALMName} />{' '}
                    (<ADNum style={{color: eRALColor}}
                            displayConfig={displayConfig}
                            value={eRALAmt} /> or {' '}
                    <ADNum style={{color: eRALColor}}
                           displayConfig={displayConfig} p
                           value={eRALAmtP} />)
                </ADStagerHLRings>
                <br />

                {/* ***** PAIR RANKS HIGHEST ***** */}

                <ADStagerHLRibbons data={data}
                                   ribbonS={pRNSHIdA} ribbonT={pRNSHIdB}
                                   changeState={changeState}>
                    Largest{transactionLabelAdj} pair:{' '}
                    <ADNam style={{color: pRNSHColorA, fontWeight: 'bold'}}
                           value={pRNSHNameA} /> - {' '}
                    <ADNam style={{color: pRNSHColorB, fontWeight: 'bold'}}
                           value={pRNSHNameB} />{' '}
                    (<ADNum style={{color: pRNSHColorAB}}
                            displayConfig={displayConfig} value={pRNSHAmtAB} />
                    {' '}or{' '}
                    <ADNum style={{color: pRNSHColorAB}}
                           displayConfig={displayConfig} p
                           value={pRNSHAmtABP} />{' '}
                    combined {dataTypeLabel}
                    )
                </ADStagerHLRibbons>

                {/* ***** PAIR RANKS LOWEST ***** */}

                <ADStagerHLRibbons data={data}
                                   ribbonS={pRNSLIdA} ribbonT={pRNSLIdB}
                                   changeState={changeState}>
                    Smallest{transactionLabelAdj} pair:{' '}
                    <ADNam style={{color: pRNSLColorA, fontWeight: 'bold'}}
                           value={pRNSLNameA} /> - {' '}
                    <ADNam style={{color: pRNSLColorB, fontWeight: 'bold'}}
                           value={pRNSLNameB} />{' '}
                    (<ADNum style={{color: pRNSLColorAB}}
                            displayConfig={displayConfig} value={pRNSLAmtAB} />
                    {' '}or{' '}
                    <ADNum style={{color: pRNSLColorAB}}
                           displayConfig={displayConfig} p
                           value={pRNSLAmtABP} />{' '}
                    combined {dataTypeLabel}
                    )
                </ADStagerHLRibbons>
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
