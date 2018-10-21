// @flow

import * as React from 'react';

import {ADNam, ADNum} from './SubComponents';
import {dataTypeAdjMapper} from '../helpers';

import type {AnalyticsDisplayProps} from '../Analytics';
import {getPair1DNameFromPairName, getPairIdsFromPairName} from '../../../data/helpers';

export default function DefaultRibbonHovered(props: AnalyticsDisplayProps) {
    const {
        data, nameData, colorScale,
        dataConfig, dataInfo, displayConfig,
        mode, stage,
        changeState,
    } = props;
    const {dataType, pairsNoSelf} = dataConfig;
    const {dataExtended, ranks, entities} = dataInfo;
    const {dataTypeLabels, entityLabel, transactionLabel} = displayConfig;

    const dataTypeLabel = dataTypeLabels[dataType];
    const transactionLabelAdj = transactionLabel ? ` ${transactionLabel}` : '';
    const dataTypeAdj = dataTypeAdjMapper[dataType];
    const ns = pairsNoSelf ? 'noSelf' : 'all';

    // Group
    const {totalGroup} = dataInfo;

    // Hovered ribbon
    let targetRibbonName;
    if (mode === 'normal' && stage.evtInfo && stage.evtInfo.type
        && stage.evtInfo.targetRibbonName) {
        targetRibbonName = stage.evtInfo.targetRibbonName;  // eslint-disable-line prefer-destructuring
    } else {
        targetRibbonName = ranks.pairs[dataType][ns][0];  // eslint-disable-line prefer-destructuring
    }

    // Pair - Use gross for ranking
    const pName = targetRibbonName[0];
    const p1DName = getPair1DNameFromPairName(pName);
    const pR = ranks.pairs.gross[ns].indexOf(p1DName);
    const firstLast = pR === ranks.pairs.gross[ns].length - 1
        ? ' (last)'
        : pR === 0
            ? ' (first)'
            : null;

    // Entities
    const [eAId, eBId] = getPairIdsFromPairName(pName);
    const eAName = nameData[eAId];
    const eAColor = colorScale(eAId);
    const eAAmt = dataExtended[dataType][eAId][eBId];
    const eAAmtP = eAAmt / entities[eAId].totals[dataType];  // Total among entity's

    const eBName = nameData[eBId];
    const eBColor = colorScale(eBId);
    const eBAmt = dataExtended[dataType][eBId][eAId];
    const eBAmtP = eBAmt / entities[eBId].totals[dataType];  // Total among entity's

    return (
        <React.Fragment>
            <div className="title fade-in">
                Viewing:{' '}
                <ADNam style={{color: eAColor}}
                       value={eAName} /> - {' '}
                <ADNam style={{color: eBColor}}
                       value={eBName} />{' '}
                {dataTypeLabel} pair.
            </div>
            <div className="description fade-in">
                {/* ***** PAIR ***** */}

                <div>
                    This is the #
                    <ADNam value={pR + 1} /> largest{' '}{firstLast}
                    {transactionLabelAdj} pair.
                </div>
                <br />

                {/* ***** ENTITY A ***** */}

                <div>
                    <ADNam style={{color: eAColor, fontWeight: 'bold'}}
                           value={eAName} />&rsquo;s
                    {dataTypeLabel}{transactionLabelAdj}{dataTypeAdj}{' '}
                    <ADNam style={{color: eBColor, fontWeight: 'bold'}}
                           value={eBName} />:{' '}
                    <ADNum style={{color: eAColor}}
                           displayConfig={displayConfig} value={eAAmt} />{' '}
                    or{' '}
                    <ADNum style={{color: eAColor}}
                           displayConfig={displayConfig} p
                           value={eAAmtP} /> of {' '}
                    <ADNam style={{color: eAColor, fontWeight: 'bold'}}
                           value={eAName} />&rsquo;s total
                    {dataTypeLabel}{transactionLabelAdj}.
                </div>

                {/* ***** ENTITY B ***** */}

                <div>
                    <ADNam style={{color: eBColor, fontWeight: 'bold'}}
                           value={eBName} />&rsquo;s
                    {dataTypeLabel}{transactionLabelAdj}{dataTypeAdj}{' '}
                    <ADNam style={{color: eAColor, fontWeight: 'bold'}}
                           value={eAName} />:{' '}
                    <ADNum style={{color: eBColor}}
                           displayConfig={displayConfig} value={eBAmt} />{' '}
                    or{' '}
                    <ADNum style={{color: eBColor}}
                           displayConfig={displayConfig} p
                           value={eBAmtP} /> of {' '}
                    <ADNam style={{color: eBColor, fontWeight: 'bold'}}
                           value={eBName} />&rsquo;s total
                    {dataTypeLabel}{transactionLabelAdj}.
                </div>

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
