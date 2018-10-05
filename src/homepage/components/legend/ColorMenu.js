// @flow

import * as React from 'react';

import ColorButton from './ColorButton';

import getRandomColor from '../../lib/utils/getRandomColor';

import defaultColorBank from '../../json/default-color-bank';

type ColorMenuProps = {
    show: boolean,
    pos: {top: number, left: number},
    asset: string,  // The asset whose color is being modified
    changeAssetColor: (asset: string, newColor: string) => void,
};

type ColorMenuStates = {
    colorString: string,
};

export default class ColorMenu extends React.PureComponent<ColorMenuProps, ColorMenuStates> {
    constructor(props: ColorMenuProps) {
        super(props);

        this.state = {
            colorString: '',
        };
    }

    changeColor = (color: string) => {
        const {asset, changeAssetColor} = this.props;

        changeAssetColor(asset, color);
    };

    handleColorStringChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        this.setState({
            colorString: e.currentTarget.value,
        });
    };

    render() {
        const {show, pos} = this.props;
        const {colorString} = this.state;

        const colorButtons = defaultColorBank.map(color => (
            <ColorButton key={color}
                         color={color}
                         changeColor={this.changeColor} />
        ));

        return (
            <div className={`${show ? '' : 'hidden'}`}>
                <div className="legend-color-menu"
                     style={{
                         top: pos.top,
                         left: pos.left,
                     }}>
                    Select a preset colour, or type in a colour code
                    <div className="legend-color-menu-color-btns">
                        {colorButtons}
                    </div>
                    <div className="legend-color-menu-color-input">
                        <ColorButton color={colorString}
                                     changeColor={this.changeColor} />
                        <input className="legend-color-menu-color-input-input"
                               type="text"
                               placeholder={`e.g. ${getRandomColor()}`}
                               value={colorString}
                               onChange={this.handleColorStringChange}
                        />
                    </div>
                </div>
            </div>

        )
    }
}
