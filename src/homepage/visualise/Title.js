// @flow

import * as React from 'react';

export default function Title() {
    return (
        <div id="visualise-title">
            <div className="title">
                <a href="/">CHORDS</a>
            </div>
            <div className="subtitle">
                A{' '}
                <a href="https://reactjs.org/"
                   target="_blank"
                   rel="noopener noreferrer">React
                </a> / {' '}
                <a href="https://d3js.org/"
                   target="_blank"
                   rel="noopener noreferrer">
                    D3.js
                </a> / {' '}
                <a href="https://sheetjs.com/"
                   target="_blank"
                   rel="noopener noreferrer">
                    SheetJS
                </a> / {' '}
                tech demo by Binh Nguyen
            </div>
            <div className="subtitle">
                Hover over the diagram to see information
                <br />
                Change sheet using the bottom control
                <br />
                Check out the top right buttons
            </div>
        </div>
    )
}
