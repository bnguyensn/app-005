// @flow

import * as React from 'react';

import ContentRing from './ContentRing';
import ContentRibbon from './ContentRibbon';

import type {ActiveItem, ColorScale, DataAll, DataConfig, DisplayConfig}
    from '../data/Types';
import type {SheetNames} from '../data/xlsx/readWorkbook';

export type ContentProps = {
    activeItem: ActiveItem,
    dataAll: DataAll,
    sheetNames: SheetNames,
    colorScale: ColorScale,
    dataConfig: DataConfig,
    displayConfig: DisplayConfig,
}

export default function Content(props: ContentProps) {
    const {
        activeItem, dataAll, sheetNames, colorScale,
        dataConfig, displayConfig,
    } = props;
    const {type, name, d} = activeItem;

    // Hovered entity

    return (
        <React.Fragment>
            {type === 'RING'
                ? (
                    <ContentRing name={name}
                                 d={d}
                                 dataAll={dataAll}
                                 sheetNames={sheetNames}
                                 colorScale={colorScale}
                                 dataConfig={dataConfig}
                                 displayConfig={displayConfig} />
                )
                : (
                    <ContentRibbon name={name}
                                   d={d}
                                   dataAll={dataAll}
                                   sheetNames={sheetNames}
                                   colorScale={colorScale}
                                   dataConfig={dataConfig}
                                   displayConfig={displayConfig} />
                )
            }
        </React.Fragment>
    )
}
