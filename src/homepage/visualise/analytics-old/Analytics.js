// @flow

import * as React from 'react';

import type {ChordRibbonData, ChordRingData}
    from '../main-chart/chart-funcs/drawChordDiagram';
import createColorScale from '../main-chart/chart-funcs/createColorScale';

import type {ColorData, Data, NameData} from '../../data/DataTypes';
import type {ColorScale} from '../main-chart/chart-funcs/createColorScale';

import '../analytics/analytics.css';

type AnalyticsProps = {
    data: ?Data,
    nameData: ?NameData,
    colorData: ?ColorData,
    chartData: ?ChordRibbonData | ?ChordRingData,
}

export default class Analytics extends React.PureComponent<AnalyticsProps, {}> {
    colorScale: ColorScale;

    constructor(props: AnalyticsProps) {
        super(props);
        if (props.colorData) {
            this.colorScale = createColorScale(props.colorData);
        }
    }

    componentDidUpdate() {
        const {colorData} = this.props;
        this.colorScale = createColorScale(colorData);
    }

    prepareData = (
        chartData: ?ChordRingData | ?ChordRibbonData,
        nameData: ?NameData,
    ) => {
        const text = {
            sName: '',
            tName: '',
            sValue: '0',
            tValue: '0',
        };
        const color = {
            s: '#212121', t: '#212121',
        };

        if (chartData && nameData) {
            if (chartData.source) {
                // Chord ribbon data

                text.sName = nameData[chartData.source.index];
                text.tName = nameData[chartData.target.index];
                text.sValue = chartData.source.value;
                text.tValue = chartData.target.value;

                color.s = this.colorScale(chartData.source.index);
                color.t = this.colorScale(chartData.target.index);
            } else {
                // Chord ring data

            }
        }

        return {text, color};
    };

    render() {
        const {chartData, nameData} = this.props;

        const {text, color} = this.prepareData(chartData, nameData);

        const sLabel = text && color
            ? <span style={{color: color.s}}>{text.sName}</span>
            : null;
        const tLabel = text && color
            ? <span style={{color: color.t}}>{text.tName}</span>
            : null;

        return (
            <div id="analytics">
                {chartData && nameData
                    ? (
                        <React.Fragment>
                            <div className="title">
                                Details for the{' '}
                                <span style={{color: color.s}}>
                                    {text.sName}
                                </span>
                                {' - '}
                                <span style={{color: color.t}}>
                                    {text.tName}
                                </span>
                                {' '}flow.
                            </div>
                            <section>
                                <div className="description">
                                    From {text.sName} to {text.tName}: {text.sValue}
                                    <br />
                                    From {text.tName} to {text.sName}: {text.tValue}
                                </div>
                            </section>
                        </React.Fragment>
                    )
                    : null
                }
            </div>
        )
    }
}
