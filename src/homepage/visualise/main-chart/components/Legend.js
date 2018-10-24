// @flow

import * as React from 'react';

import Label from './LegendLabel';
import LegendColorMenu from './LegendColorMenu';
import LegendEmpty from './LegendEmpty';

import type {ColorData, CompanyData} from '../../data/Types';

import './legend.css';

type LegendProps = {
    data: ?CompanyData[],
    colorData: ?ColorData,
    curCompany: string,
    changeColorData: (name: string, newColor: string) => void,
};

type LegendStates = {
    colorMenuShow: boolean,
    colorMenuPos: {top: number, left: number},
    curItem: string,
};

export default class Legend
    extends React.PureComponent<LegendProps, LegendStates> {
    constructor(props: LegendProps) {
        super(props);

        this.state = {
            colorMenuShow: false,
            colorMenuPos: {top: 0, left: 0},
            curItem: '',
        };
    }

    toggleColorMenu = (itemName: string, el: HTMLDivElement) => {
        this.setState(prevState => ({
            colorMenuShow: prevState.curItem === itemName
                ? !prevState.colorMenuShow
                : true,
            colorMenuPos: {top: el.offsetTop, left: el.offsetLeft},
            curItem: itemName,
        }));
    };

    render() {
        const {data, colorData, curCompany, changeColorData} = this.props;
        const {colorMenuShow, colorMenuPos, curItem} = this.state;

        let labels = [];

        if (data && colorData) {
            // Available colors
            const availableItems = Object.keys(colorData[curCompany]);

            // Generate labels
            labels = availableItems.length > 0
                ? availableItems.map(itemName => (
                    <Label key={itemName}
                           color={colorData[curCompany][itemName] || '#212121'}
                           itemName={itemName}
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
                                 itemName={curItem}
                                 changeItemColor={changeColorData} />
            </div>
        )
    }
}
