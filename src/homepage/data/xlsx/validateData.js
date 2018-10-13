// @flow

import {validateAssetSheetData, validateFundSheetData} from './dataValidation';

export default function validateData(
    fundSheetData: any,
    assetSheetData: any,
): [string[], string[]] {
    try {
        const fundDataErrMsgs = validateFundSheetData(
            fundSheetData,
        );
        const assetDataErrMsgs = validateAssetSheetData(
            assetSheetData,
        );

        return [fundDataErrMsgs, assetDataErrMsgs]
    } catch (e) {
        throw e
    }
}
