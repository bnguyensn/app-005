// @flow

import * as React from 'react'

import {getPair1DNameFromPairName, getPairIdsFromPairName}
    from '../data/helpers/helpers';
import {ADNam, ADNum} from '../analytics/displays/SubComponents';

import type {Chord} from '../main-chart/chart-funcs/createChordData';
import type {ColorScale, DataAll, DataConfig, DisplayConfig}
    from '../data/Types';
import type {SheetNames} from '../data/xlsx/readWorkbook';
import {transactionAdjectives} from '../analytics/helpers';

export type ContentRibbonProps = {
    name: string,
    d: Chord,
    dataAll: DataAll,
    sheetNames: SheetNames,
    colorScale: ColorScale,
    dataConfig: DataConfig,
    displayConfig: DisplayConfig,
}

export default function ContentRibbon(props: ContentRibbonProps) {
    const {
        name: pName, d,
        dataAll, sheetNames, colorScale,
        dataConfig, displayConfig,
    } = props;

    const {dataType, pairsNoSelf, sheetsOrder, curSheet} = dataConfig;
    const {
        dataTypeLabels, entityLabel, transactionLabel,
        amtPrefix, amtSuffix, amtRounding,
    } = displayConfig;
    const {dataInfo, nameData} = dataAll[sheetNames[curSheet]];
    const {dataExtended, entities} = dataInfo;
    const data = dataExtended[dataType];

    const dTL = ` ${dataTypeLabels[dataType]}`;
    const tL = transactionLabel ? ` ${transactionLabel}` : '';
    const tA = transactionAdjectives[dataType];
    const ns = pairsNoSelf ? 'noSelf' : 'all';

    // Group
    const {totalGroup} = dataInfo;

    // Pair
    const p1DName = getPair1DNameFromPairName(pName);

    // Entities
    const [eAId, eBId] = getPairIdsFromPairName(pName);
    const eAName = nameData[eAId];
    const eAColor = colorScale(eAId);
    const eAAmt = dataExtended[dataType][eAId][eBId];
    // Total among entity's
    const eAAmtP = eAAmt / entities[eAId].totals[dataType];

    const eBName = nameData[eBId];
    const eBColor = colorScale(eBId);
    const eBAmt = dataExtended[dataType][eBId][eAId];
    // Total among entity's
    const eBAmtP = eBAmt / entities[eBId].totals[dataType];

    return (
        <React.Fragment>
            {/* ***** TITLE ***** */}

            <div className="title">
                <ADNam style={{color: eAColor}}
                       value={eAName} /> -{' '}
                <ADNam style={{color: eBColor}}
                       value={eBName} />
            </div>

            {/* ***** ENTITY A ***** */}

            <div className="description">
                <ADNam style={{color: eAColor}}
                       value={eAName} />{tA}{' '}
                <ADNam style={{color: eBColor}}
                       value={eBName} />:{' '}
                <ADNum style={{color: eAColor}}
                       displayConfig={displayConfig} value={eAAmt} /> (
                <ADNum style={{color: eAColor}}
                       displayConfig={displayConfig} p
                       value={eAAmtP} /> of{' '}
                <ADNam style={{color: eAColor}}
                       value={eAName} />&rsquo;s total).
            </div>

            {/* ***** ENTITY B ***** */}

            <div className="description">
                <ADNam style={{color: eBColor}}
                       value={eBName} />{tA}{' '}
                <ADNam style={{color: eAColor}}
                       value={eAName} />:{' '}
                <ADNum style={{color: eBColor}}
                       displayConfig={displayConfig} value={eBAmt} /> (
                <ADNum style={{color: eBColor}}
                       displayConfig={displayConfig} p
                       value={eBAmtP} /> of{' '}
                <ADNam style={{color: eBColor}}
                       value={eBName} />&rsquo;s total).
            </div>
        </React.Fragment>
    )
}
