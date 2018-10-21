// @flow

import * as React from 'react';

import {DisplayGeneric, DisplayNumber, DisplayStageCreator} from './SubComponents';
import {formatAmount} from '../helpers';

import type {AnalyticsDisplayProps} from '../Analytics';

export default function DefaultRingHovered(props: AnalyticsDisplayProps) {
    const {
        data, nameData, colorScale,
        dataConfig, dataInfo,
        mode, stage,
        changeState,
    } = props;
    const {outflow, label} = dataConfig;
    const {entities, rows, rowItemSorts, totalGroup} = dataInfo;

    const {targetRingIndex} = stage.evtInfo;

    const inOutL = outflow ? ' outflows' : ' inflows';
    const inOutTL = outflow ? ' inflows' : ' outflows';
    const labelL = label ? ` ${label}` : '';

    // Entity
    const eI = Number(targetRingIndex[0]);
    const eName = nameData[eI];
    const eColor = colorScale(eI);

    // Entity - Total ranking
    const eTotalRank = entities[eName].rowSorts.total;
    const eTotalAmt = rows[eI].total;
    const eTotalAmtP = eTotalAmt / totalGroup;

    // Entity - Row T ranking
    const eTotalTRank = entities[eName].rowSorts.totalT;
    const eTotalTAmt = rows[eI].totalT;
    const eTotalTAmtP = eTotalTAmt / totalGroup;

    // Partner (GROSS)
    const partnersG = rowItemSorts.rowG[eI];
    const partnersGTotal = rows[eI].totalG;
    const incSelf = false;

    // Entity - Largest partner
    const eLPartnerI = incSelf
        ? partnersG[0].index
        : partnersG[0].index === eI
            ? partnersG[1].index
            : partnersG[0].index;
    const eLPartnerName = nameData[eLPartnerI];
    const eLPartnerColor = colorScale(eLPartnerI);
    const eLPartnerAmt = rows[eI].row[eLPartnerI];
    const eLPartnerAmtP = eLPartnerAmt / partnersGTotal;  // Note: p across row only

    // Entity - Smallest partner
    const eSPartnerI = incSelf
        ? partnersG[partnersG.length - 1].index
        : partnersG[partnersG.length - 1].index === eI
            ? partnersG[partnersG.length - 2].index
            : partnersG[partnersG.length - 1].index;
    const eSPartnerName = nameData[eSPartnerI];
    const eSPartnerColor = colorScale(eSPartnerI);
    const eSPartnerAmt = rows[eI].row[eSPartnerI];
    const eSPartnerAmtP = eSPartnerAmt / partnersGTotal;  // Note: p across row only

    return (
        <React.Fragment>
            <div className="title fade-in">
                Viewing:{' '}
                <DisplayGeneric style={{color: eColor}}
                                value={eName} />
            </div>
            <div className="description fade-in">
                {/* ***** ROW RANKING ***** */}

                Ranked #{eTotalRank + 1} most{labelL}{inOutL}{' '}
                (<DisplayNumber style={{color: eColor}}
                                dataConfig={dataConfig}
                                value={eTotalAmt} />
                {' '}
                or <DisplayNumber style={{color: eColor}}
                                  dataConfig={dataConfig}
                                  p
                                  value={eTotalAmtP} />
                {' '}
                of total)

                <br />

                {/* ***** ROW T RANKING ***** */}

                Ranked #{eTotalTRank + 1} most{labelL}{inOutTL}{' '}
                (<DisplayNumber style={{color: eColor}}
                                dataConfig={dataConfig}
                                value={eTotalTAmt} />
                {' '}
                or <DisplayNumber style={{color: eColor}}
                                  dataConfig={dataConfig}
                                  p
                                  value={eTotalTAmtP} />
                {' '}
                of total)

                <br /><br />

                {/* ***** PARTNER RANKING ***** */}

                Largest{labelL} partner:
                <DisplayGeneric style={{
                    color: eLPartnerColor,
                    fontWeight: 'bold',
                }}
                                value={eLPartnerName} />{' '}
                (<DisplayNumber style={{color: eLPartnerColor}}
                                dataConfig={dataConfig}
                                value={eLPartnerAmt} />{' '}
                or <DisplayNumber style={{color: eLPartnerColor}}
                                  dataConfig={dataConfig}
                                  p
                                  value={eLPartnerAmtP} />{' '}
                of total)

                <br />

                Smallest{labelL} partner:
                <DisplayGeneric style={{
                    color: eSPartnerColor,
                    fontWeight: 'bold',
                }}
                                value={eSPartnerName} />{' '}
                (<DisplayNumber style={{color: eSPartnerColor}}
                                dataConfig={dataConfig}
                                value={eSPartnerAmt} />{' '}
                or <DisplayNumber style={{color: eSPartnerColor}}
                                  dataConfig={dataConfig}
                                  p
                                  value={eSPartnerAmtP} />{' '}
                of total )

                <br />

                {/* ***** FOOTNOTE ***** */}

                <div className="footnote">
                    Move mouse out of the diagram to see overall statistics.
                    <br />
                    Hover over the diagram to show different analytics.
                </div>
            </div>
        </React.Fragment>
    )
}
