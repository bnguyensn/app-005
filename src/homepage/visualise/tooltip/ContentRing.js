// @flow

import * as React from 'react';


import {ADNam, ADNum} from '../analytics/displays/SubComponents';

import type {ChordGroup} from '../main-chart/chart-funcs/createChordData';
import type {ColorScale, DataAll, DataConfig, DisplayConfig, NameData}
    from '../data/Types';
import type {SheetNames} from '../data/xlsx/readWorkbook';
import capFirstLtr from '../../lib/capFirstLtr';

export type ContentRingProps = {
    name: number,
    d: ChordGroup,
    dataAll: DataAll,
    sheetNames: SheetNames,
    colorScale: ColorScale,
    dataConfig: DataConfig,
    displayConfig: DisplayConfig,
}

export default function ContentRing(props: ContentRingProps) {
    const {
        name: eId, d,
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
    const ns = pairsNoSelf ? 'noSelf' : 'all';

    // Group
    const {totalGroup} = dataInfo;

    // Entity
    const eName = nameData[eId];
    const eColor = colorScale(eId);

    // Total
    const eTotalAmt = entities[eId].totals[dataType];
    const eTotalAmtP = entities[eId].totals[dataType] / totalGroup[dataType];
    const eTotalRank = entities[eId].ranks.all[dataType];

    return (
        <React.Fragment>
            {/* ***** TITLE ***** */}

            <div className="title">
                <ADNam style={{color: eColor}}
                       value={eName} />
            </div>

            {/* ***** TOTAL ***** */}

            <div className="description">
                {capFirstLtr(dTL)}{tL}:{' '}
                <ADNum style={{color: eColor}}
                       displayConfig={displayConfig}
                       value={eTotalAmt} /> (
                <ADNum style={{color: eColor}}
                       displayConfig={displayConfig} p
                       value={eTotalAmtP} />
                ). Ranked #
                <ADNam style={{color: eColor}}
                       value={eTotalRank + 1} />
                {eTotalRank === nameData.length - 1
                    ? ' (last)'
                    : eTotalRank === 0
                        ? ' (first)'
                        : null}.
            </div>
        </React.Fragment>
    )
}
