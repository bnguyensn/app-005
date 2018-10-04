// @flow

import * as React from 'react';

import type {ColorData, FundData} from './DataTypes';

type LabelProps = {
    color: string,
    text: string,  // This is the asset name
    changeAssetColor: (asset: string) => void,
};

function Label(props: LabelProps) {
    const {color, text, changeAssetColor} = props;

    const handleColorSquareClick = () => {
        changeAssetColor(text);
    };

    const handleColorSquareKeyPress = (e: SyntheticKeyboardEvent<HTMLElement>) => {
        if (e.key === 'enter') {
            changeAssetColor(text);
        }
    };

    return (
        <div className="legend-label">
            <div className="legend-label-color"
                 role="button" tabIndex={0}
                 style={{
                     backgroundColor: color,
                 }}
                 onClick={handleColorSquareClick}
                 onKeyPress={handleColorSquareKeyPress} />
            <div className="legend-label-text">
                {text}
            </div>
        </div>
    )
}

type LegendProps = {
    data: FundData[],
    colorData: ColorData[],
    changeAssetColor: (asset: string) => void,
};

export default class Legend extends React.PureComponent<LegendProps, {}> {
    constructor(props: LegendProps) {
        super(props);
        
    }

    render() {
        return (
            <div className="legend">

            </div>
        )
    }
}
