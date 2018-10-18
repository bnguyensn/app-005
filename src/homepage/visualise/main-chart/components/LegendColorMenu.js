// @flow

import * as React from 'react';

import ColorButton from './LegendColorButton';

import getRandomColor from '../../../lib/getRandomColor';

import defaultColorBank from '../../../data/json/default-color-bank-01';

type ColorMenuProps = {
    show: boolean,
    pos: {top: number, left: number},
    itemName: string,  // The asset whose color is being changed
    changeItemColor: (name: string, newColor: string) => void,
};

type ColorMenuStates = {
    colorString: string,
};

export default class LegendColorMenu extends React.PureComponent<ColorMenuProps, ColorMenuStates> {
    constructor(props: ColorMenuProps) {
        super(props);

        this.state = {
            colorString: '',
        };
    }

    submitNewColor = (color: string) => {
        const {itemName, changeItemColor} = this.props;

        changeItemColor(itemName, color);
    };

    handleColorStringChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        this.setState({
            colorString: e.currentTarget.value,
        });
    };

    render() {
        const {show, pos} = this.props;
        const {colorString} = this.state;

        const presetColorButtons = defaultColorBank.map(color => (
            <ColorButton key={color}
                         color={color}
                         submitNewColor={this.submitNewColor} />
        ));

        return (
            <div className={`${show ? '' : 'hidden'}`}>
                <div className="legend-color-menu"
                     style={{
                         top: pos.top,
                         left: pos.left,
                     }}>
                    Select a preset colour, OR type in a colour code
                    <div className="legend-color-menu-preset-color-btns">
                        {presetColorButtons}
                    </div>
                    <div className="legend-color-menu-color-input">
                        <ColorButton color={colorString}
                                     submitNewColor={this.submitNewColor} />
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
