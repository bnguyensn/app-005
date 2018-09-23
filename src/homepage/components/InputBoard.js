// @flow

import * as React from 'react';
import Input from './Input';
import '../css/newfund.css';

type InputBoardProps = {}

type AssetData = {
    // Effectively, we are using an asset's array index as its id. Since we don't
    // expect the assets to be re-ordered, this is fine.
    id: number,

    name: string,
    lvl: number,
    amt: number
};

type InputBoardStates = {
    assets: AssetData[],
};

export default class InputBoard extends React.PureComponent<InputBoardProps, InputBoardStates> {
    assetIdsCount: number;

    constructor(props: InputBoardProps) {
        super(props);
        this.assetIdsCount = 0;
        this.state = {
            assets: [this.addNewAsset()],
        };
    }

    addNewAsset = () => {
        const newAsset = {
            id: this.assetIdsCount,
            name: '',
            lvl: '',
            amt: '',
        };
        this.assetIdsCount += 1;
        return newAsset
    };

    handleAssetInputChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const {assets} = this.state;
        const {name: nameStr, value: updatedAssetValue} = e.target;

        // Find relevant asset information
        const nameStrArr = nameStr.split(' ');

        const assetId = Number(nameStrArr[nameStrArr.length - 1]);
        const updatedAssetKey = nameStrArr[nameStrArr.length - 2];

        // Create new asset object
        const updatedAsset = Object.assign({}, assets[assetId]);
        updatedAsset[updatedAssetKey] = updatedAssetValue;

        // Create new asset array
        const newAssets = [...assets];
        newAssets[assetId] = updatedAsset;

        // Add the next asset object if the asset being changed is the last one
        if (this.assetIdsCount - 1 === assetId) {
            newAssets.push(this.addNewAsset());
        }

        // Debug
        /*console.log(`assetId: ${assetId}`);
        console.log(`updatedAssetKey: ${updatedAssetKey}`);
        console.log(`updatedAssetValue: ${updatedAssetValue}`);
        console.log(`updatedAsset: ${JSON.stringify(updatedAsset)}`);
        console.log(`newAssets: ${newAssets}`);*/

        // Update state
        this.setState({
            assets: newAssets,
        });
    };

    render() {
        const {assets} = this.state;

        const assetInputs = assets.length > 0
            ? assets.map(asset => (
                <div key={asset.id}>
                    <Input name={`Asset name ${asset.id}`}
                           labelText="Asset name:"
                           type="text"
                           placeholder="e.g. Cash, Debtors, etc."
                           value={asset.name}
                           handleChange={this.handleAssetInputChange} />
                    <Input name={`Asset lvl ${asset.id}`}
                           labelText="Asset level:"
                           type="number"
                           min="1" max="1000"
                           value={asset.lvl}
                           handleChange={this.handleAssetInputChange} />
                    <Input name={`Asset amt ${asset.id}`}
                           labelText="Asset amount:"
                           type="number"
                           min="0" max="999999999999"
                           value={asset.amt}
                           handleChange={this.handleAssetInputChange} />
                </div>
            ))
            : null;

        return (
            <div id="newfund-dashboard">
                <span>ADD NEW FUND</span>
                <span>Fill in the form below to add a new fund to your data</span>
                <div>
                    <span>Fund information</span>
                    <Input name="fName" labelText="Fund name:" type="text" />
                    <Input name="iCom" labelText="Investors' commitment:" type="number"
                           min="0" max="999999999999" />
                    <Input name="fCom" labelText="Fund's commitment in its investments:" type="number"
                           min="0" max="999999999999" />
                    <Input name="fCal" labelText="Called capital from fund's investments:" type="number"
                           min="0" max="999999999999" />
                </div>
                <div>
                    <span>Asset information</span>
                    {assetInputs}
                </div>
            </div>
        )
    }
}
