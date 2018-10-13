// @flow

import * as React from 'react';

import Label from './LegendLabel';
import LegendColorMenu from './LegendColorMenu';
import LegendEmpty from './LegendEmpty';

import type {ColorData, FundData} from '../../../data/DataTypes';

import './legend.css';

type LegendProps = {
    data: ?FundData[],
    colorData: ?ColorData,
    changeColorData: (type: string, name: string, newColor: string) => void,
};

type LegendStates = {
    colorMenuShow: boolean,
    colorMenuPos: {top: number, left: number},
    curAsset: string,
};

export default class Legend
    extends React.PureComponent<LegendProps, LegendStates> {
    constructor(props: LegendProps) {
        super(props);

        this.state = {
            colorMenuShow: false,
            colorMenuPos: {top: 0, left: 0},
            curAsset: '',
        };
    }

    toggleColorMenu = (assetName: string, el: HTMLDivElement) => {
        this.setState(prevState => ({
            colorMenuShow: prevState.curAsset === assetName
                ? !prevState.colorMenuShow
                : true,
            colorMenuPos: {top: el.offsetTop, left: el.offsetLeft},
            curAsset: assetName,
        }));
    };

    render() {
        const {data, colorData, changeColorData} = this.props;
        const {colorMenuShow, colorMenuPos, curAsset} = this.state;

        let labels = [];

        if (data && colorData) {
            // Assets currently showing in the main chart
            const availableAssets = data[0].assets.map(asset => asset.name);

            // Add Remaining investment commitments
            availableAssets.push('Remaining investment commitments');

            // Generate labels
            labels = availableAssets.length > 0
                ? availableAssets.map(assetName => (
                    <Label key={assetName}
                           color={colorData.assets[assetName] || '#212121'}
                           assetName={assetName}
                           toggleColorMenu={this.toggleColorMenu} />
                ))
                : [];
        }

        return (
            <div id="legend">
                {data && colorData && labels.length > 0
                    ? labels
                    : <LegendEmpty />}
                <LegendColorMenu show={colorMenuShow}
                                 pos={colorMenuPos}
                                 assetName={curAsset}
                                 changeAssetColor={changeColorData} />
            </div>
        )
    }
}
