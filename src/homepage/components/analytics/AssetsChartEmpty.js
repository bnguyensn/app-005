// @flow

import * as React from 'react';

import type {AssetsChartSize} from './AssetsChart';

type EmptyAnalyticsProps = {
    size: AssetsChartSize,
};

export default function AssetsChartEmpty(props: EmptyAnalyticsProps) {
    const {size} = props;

    return (
        <div style={{
            width: size.width + size.margin.left + size.margin.right,
            height: size.height + size.margin.top + size.margin.bottom,
        }}>
            Click on a fund column to see analytics.
        </div>
    )
}
