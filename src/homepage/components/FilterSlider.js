// @flow

import * as React from 'react';

import withPanningEvents from '../lib/hocs/withPanningEvents';

import type {FundData} from './DataTypes';

/** ********** TEXT STATUS ********** **/

type TextStatusProps = {
    dataRange: {min: number, max: number},
};

function TextStatus(props: TextStatusProps) {
    const {dataRange, ...rest} = props;

    return (
        <div className="cp-filter-text-status-container" {...rest}
             draggable={false}>
            {`Data range: ${(dataRange.min * 100).toFixed(0)}% - `
            + `${(dataRange.max * 100).toFixed(0)}%`}
        </div>
    )
}

/** ********** LONG BAR ********** **/

function LongBar(props: {children?: React.Node}) {
    const {children} = props;

    const drag = (e: SyntheticMouseEvent<HTMLElement>) => {
        e.preventDefault();
    };

    return (
        <div className="cp-filter-long-bar" {...props}
             draggable={false}
             onDrag={drag}>
            {children || null}
        </div>
    )
}

/** ********** STOP BAR ********** **/

type StopBarProps = {
    size: {width: number, height: number},
    offset: {x: number, y: number},
};

function StopBar(props: StopBarProps) {
    const {size, offset, ...rest} = props;

    return (
        <div className="cp-filter-stop-bar-container"
             draggable={false}
             style={{
                 position: 'absolute',
                 width: 0,
                 height: 0,
             }}>
            <div className="cp-filter-stop-bar"
                 draggable={false}
                 style={{
                     position: 'relative',
                     borderRadius: '5px',
                     backgroundColor: '#4C6F71',
                     width: size.width,
                     height: size.height,
                     transform: `translate(${offset.x}px, ${offset.y}px)`,
                 }}
                 {...rest} />
        </div>
    )
}

/** ********** SLIDER ********** **/

type FilterSliderProps = {
    size: {
        longBar: {width: number, height: number},
        stopBar: {width: number, height: number},
    };
    setFilterRange: (min: number, max: number) => void,
};

type FilterSliderStates = {
    stopBarOffsets: {x: number, y: number}[],
    dataRange: {min: number, max: number},
};

export default class FilterSlider extends React.PureComponent<FilterSliderProps, FilterSliderStates> {
    stopBars: any[];
    stopBarLimits: {xMin: number, xMax: number, yMin: number, yMax: number}[];

    sliderReseter: boolean;

    constructor(props: FilterSliderProps) {
        super(props);

        this.state = {
            stopBarOffsets: [
                {x: 0, y: -props.size.stopBar.height / 4},
                {x: props.size.longBar.width - props.size.stopBar.width, y: -props.size.stopBar.height / 4},
            ],
            dataRange: {
                min: 0,
                max: 1,
            },
        };

        this.stopBarLimits = [
            {
                xMin: 0,
                xMax: props.size.longBar.width - props.size.stopBar.width * 2,
                yMin: 0,
                yMax: 0,
            },
            {
                xMin: props.size.stopBar.width,
                xMax: props.size.longBar.width - props.size.stopBar.width,
                yMin: 0,
                yMax: 0,
            },
        ];

        this.stopBars = [
            withPanningEvents(StopBar),
            withPanningEvents(StopBar),
        ];

        this.sliderReseter = false;

        this.isUpdating = false;
    }

    componentDidUpdate() {
        this.isUpdating = false;
    }

    componentWillUnmount() {
        console.log('FilterSlider unmounting!');
    }

    offsetWithinLimitX = (stopBarIndex: number, offsetX: number): boolean => (
        offsetX >= this.stopBarLimits[stopBarIndex].xMin
        && offsetX <= this.stopBarLimits[stopBarIndex].xMax
    );

    moveStopBarX = (stopBarIndex: number, movingDistX: number): void => {
        const {size, setFilterRange} = this.props;
        const {stopBarOffsets} = this.state;

        // Calculate new StopBar position
        const newOffsetX = stopBarOffsets[stopBarIndex].x + movingDistX;

        if (this.offsetWithinLimitX(stopBarIndex, newOffsetX) && !this.isUpdating) {
            // New StopBar position is valid

            this.isUpdating = true;

            // Calculate new limits
            // Moving a StopBar affects the limits of its sandwiching StopBars
            if (stopBarIndex !== 0) {
                this.stopBarLimits[stopBarIndex - 1].xMax = newOffsetX - size.stopBar.width;
            } else if (stopBarIndex !== stopBarOffsets.length - 1) {
                this.stopBarLimits[stopBarIndex + 1].xMin = size.stopBar.width + newOffsetX;
            }

            // Re-render and update data range
            const newStopBarOffsets = [...stopBarOffsets];
            newStopBarOffsets[stopBarIndex] = {
                x: newOffsetX,
                y: stopBarOffsets[stopBarIndex].y,
            };

            const newDataRangeMin = newStopBarOffsets[0].x
                / (size.longBar.width - size.stopBar.width);
            const newDataRangeMax = newStopBarOffsets[1].x
                / (size.longBar.width - size.stopBar.width);

            setFilterRange(newDataRangeMin, newDataRangeMax);

            this.setState({
                stopBarOffsets: newStopBarOffsets,
                dataRange: {
                    min: newDataRangeMin,
                    max: newDataRangeMax,
                },
            });
        }
    };

    render() {
        const {size} = this.props;
        const {stopBarOffsets, dataRange} = this.state;

        const stopBarEls = this.stopBars.map((StopBarWithPanningEvents, i) => (
            <StopBarWithPanningEvents key={i}  // We don't expect the stopBars array to change, so index keys are fine
                                      id={i}
                                      moveX={this.moveStopBarX}
                                      size={size.stopBar}
                                      offset={stopBarOffsets[i]} />
        ));

        return (
            <div className="cp-filter-slider">
                <LongBar
                    style={{width: size.longBar.width, height: size.longBar.height}}>
                    {stopBarEls}
                </LongBar>
                <TextStatus dataRange={dataRange} />
            </div>
        )
    }
}
