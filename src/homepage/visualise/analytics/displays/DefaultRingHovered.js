// @flow

import * as React from 'react';

import {ADNam, ADNum} from './SubComponents';
import capFirstLtr from '../../../lib/capFirstLtr';

import type {AnalyticsDisplayProps} from '../Analytics';
import {getEntityPartnerIdFromPartnerRank} from '../../data/helpers/helpers';

export default function DefaultRingHovered(props: AnalyticsDisplayProps) {
    const {
        dataAll, sheetNames, colorScale,
        dataConfig, displayConfig,
        mode, stage,
        changeState,
    } = props;
    const {dataType, pairsNoSelf, curSheet} = dataConfig;
    const {dataTypeLabels, entityLabel, transactionLabel} = displayConfig;

    const {dataInfo, nameData} = dataAll[sheetNames[curSheet]];
    const {dataExtended, entities} = dataInfo;
    const data = dataExtended[dataType];

    const dataTypeLabel = ` ${dataTypeLabels[dataType]}`;
    const transactionLabelAdj = transactionLabel ? ` ${transactionLabel}` : '';
    const ns = pairsNoSelf ? 'noSelf' : 'all';

    // Group
    const {totalGroup} = dataInfo;

    // Hovered entity
    let targetRingIndex;
    if (mode === 'normal' && stage.evtInfo && stage.evtInfo.type
        && stage.evtInfo.targetRingIndex) {
        targetRingIndex = stage.evtInfo.targetRingIndex;  // eslint-disable-line prefer-destructuring
    } else {
        targetRingIndex = 0;
    }

    // Entity
    const eId = Number(targetRingIndex[0]);
    const eName = nameData[eId];
    const eColor = colorScale(eId);

    // Total
    const eTotalAmt = entities[eId].totals[dataType];
    const eTotalAmtP = entities[eId].totals[dataType] / totalGroup[dataType];
    const eTotalRank = entities[eId].ranks.all[dataType];

    // Partner ranked highest (ePH)
    const ePHId = getEntityPartnerIdFromPartnerRank(
        dataInfo, eId, 0, dataType, pairsNoSelf,
    );
    const ePHName = nameData[ePHId];
    const ePHColor = colorScale(ePHId);
    const ePHAmt = dataExtended[dataType][eId][ePHId];
    const ePHAmtP = ePHAmt / entities[eId].totals[dataType];

    // Partner ranked lowest (ePL)
    const ePLId = getEntityPartnerIdFromPartnerRank(
        dataInfo, eId, 'LAST', dataType, pairsNoSelf,
    );
    const ePLName = nameData[ePLId];
    const ePLColor = colorScale(ePLId);
    const ePLAmt = dataExtended[dataType][eId][ePLId];
    const ePLAmtP = ePLAmt / entities[eId].totals[dataType];

    return (
        <React.Fragment>
            <div className="title fade-in">
                Viewing:{' '}
                <ADNam style={{color: eColor}}
                       value={eName} />
            </div>
            <div className="description fade-in">
                {/* ***** TOTAL ***** */}

                <div>
                    {capFirstLtr(dataTypeLabel)}{transactionLabelAdj}:{' '}
                    <ADNum style={{color: eColor}}
                           displayConfig={displayConfig}
                           value={eTotalAmt} /> or{' '}
                    <ADNum style={{color: eColor}}
                           displayConfig={displayConfig} p
                           value={eTotalAmtP} />{' '}
                    of total. Ranked #
                    <ADNam style={{color: eColor}}
                           value={eTotalRank + 1} />
                    {eTotalRank === nameData.length - 1
                        ? ' (last)'
                        : eTotalRank === 0
                            ? ' (first)'
                            : null}.
                </div>
                <br />

                {/* ***** PARTNER RANKED HIGHEST ***** */}

                <div>
                    Largest{dataTypeLabel}{transactionLabelAdj} partner:{' '}
                    <ADNam style={{color: ePHColor, fontWeight: 'bold'}}
                           value={ePHName} />{' '}
                    (<ADNum style={{color: eColor}}
                            displayConfig={displayConfig} value={ePHAmt} />{' '}
                    or{' '}
                    <ADNum style={{color: eColor}}
                           displayConfig={displayConfig} p
                           value={ePHAmtP} /> of{' '}
                    <ADNam style={{color: eColor, fontWeight: 'bold'}}
                           value={eName} />&rsquo;s total
                    {dataTypeLabel}{transactionLabelAdj}.
                </div>

                {/* ***** PARTNER RANKED LOWEST ***** */}

                <div>
                    Smallest{dataTypeLabel}{transactionLabelAdj} partner:{' '}
                    <ADNam style={{color: ePLColor, fontWeight: 'bold'}}
                           value={ePLName} />{' '}
                    (<ADNum style={{color: eColor}}
                            displayConfig={displayConfig} value={ePLAmt} />{' '}
                    or{' '}
                    <ADNum style={{color: eColor}}
                           displayConfig={displayConfig} p
                           value={ePLAmtP} /> of{' '}
                    <ADNam style={{color: eColor, fontWeight: 'bold'}}
                           value={eName} />&rsquo;s total
                    {dataTypeLabel}{transactionLabelAdj}.
                </div>
                <br />

                {/* ***** FOOTNOTE ***** */}

                <div className="footnote">
                    Move mouse out of the diagram to see overall statistics.
                    <br />
                    Hover over a different part of the diagram to show{' '}
                    different analytics.
                </div>
            </div>
        </React.Fragment>
    )
}
