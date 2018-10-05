// @flow

import * as React from 'react';

import Label from './Label';
import ColorMenu from './ColorMenu';

import type {ColorData, FundData} from '../DataTypes';

import './legend.css';

type LegendProps = {
    data: FundData[],
    colorData: ColorData,
    changeChartComponentColor: (asset: string, newColor: string) => void,
};

type LegendStates = {
    colorMenuShow: boolean,
    colorMenuPos: {top: number, left: number},
    curAsset: string,
};

export default class Legend extends React.PureComponent<LegendProps, LegendStates> {
    constructor(props: LegendProps) {
        super(props);

        this.state = {
            colorMenuShow: false,
            colorMenuPos: {top: 0, left: 0},
            curAsset: '',
        };
    }

    toggleColorMenu = (asset: string, el: HTMLDivElement) => {
        this.setState(prevState => ({
            colorMenuShow: prevState.curAsset === asset
                ? !prevState.colorMenuShow
                : true,
            colorMenuPos: {top: el.offsetTop, left: el.offsetLeft},
            curAsset: asset,
        }));
    };

    render() {
        const {data, colorData, changeChartComponentColor} = this.props;
        const {colorMenuShow, colorMenuPos, curAsset} = this.state;

        const chartComponents = Object.keys(colorData);
        const labels = chartComponents.length > 0
            ? chartComponents.map(chartComponent => (
                <Label key={chartComponent}
                       color={colorData[chartComponent]}
                       asset={chartComponent}
                       toggleColorMenu={this.toggleColorMenu} />
            ))
            : [];

        return (
            <div id="legend">
                {labels}
                <ColorMenu show={colorMenuShow}
                           pos={colorMenuPos}
                           asset={curAsset}
                           changeAssetColor={changeChartComponentColor} />
            </div>
        )
    }
}
