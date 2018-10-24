// @flow

import * as React from 'react';

import {ADNam, ADNum} from './SubComponents';
import {dataTypeAdjMapper} from '../helpers';

import type {AnalyticsDisplayProps} from '../Analytics';
import {
    getPair1DNameFromPairName,
    getPairIdsFromPairName,
    getPairRankingWithinEntity,
} from '../../data/helpers/helpers';

export default function DefaultRibbonHovered(props: AnalyticsDisplayProps) {
    const {
        dataAll, sheetNames, colorScale,
        dataConfig, displayConfig,
        mode, stage,
        changeState,
    } = props;
    const {dataType, pairsNoSelf, curSheet} = dataConfig;
    const {dataTypeLabels, entityLabel, transactionLabel} = displayConfig;

    const {dataInfo, nameData} = dataAll[sheetNames[curSheet]];
    const {dataExtended, ranks, entities} = dataInfo;
    const data = dataExtended[dataType];

    const dataTypeLabel = ` ${dataTypeLabels[dataType]}`;
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

    // Pair
    const pName = targetRibbonName[0];
    const p1DName = getPair1DNameFromPairName(pName);

    // Pair - Ranking across the whole group (use 'gross')
    const pR = ranks.pairs.gross[ns].indexOf(p1DName);

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

    // Pair - ranking across entities
    const pRA = getPairRankingWithinEntity(
        entities, dataConfig, pName, eAId,
    );
    const pRB = getPairRankingWithinEntity(
        entities, dataConfig, pName, eBId,
    );

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
                    <ADNam value={pR + 1} /> largest{' '}
                    {transactionLabelAdj} pair of the whole group.
                    <br />
                    This is the #
                    <ADNam value={pRA + 1} /> largest{' '}
                    {transactionLabelAdj} pair of{' '}
                    <ADNam style={{color: eAColor, fontWeight: 'bold'}}
                           value={eAName} />.
                    <br />
                    This is the #
                    <ADNam value={pRB + 1} /> largest{' '}
                    {transactionLabelAdj} pair of{' '}
                    <ADNam style={{color: eBColor, fontWeight: 'bold'}}
                           value={eBName} />.
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
