// @flow

import * as React from 'react';

import LightboxClose from './LightboxClose';
import {ClickableDiv} from '../lib/components/Clickable';

type InfoProps = {
    toggle: () => void,
}

export default function Info(props: InfoProps) {
    const {toggle} = props;

    const handleClick = (e) => {
        e.stopPropagation();
    };

    return (
        <ClickableDiv id="visualise-info"
                      action={handleClick}>
            <LightboxClose toggle={toggle} />

            <div className="title">
                CHORDS v1.4.0
                <div className="subtitle">
                    - A chord diagram generator -
                </div>
            </div>

            <section>
                <div className="title">
                    About
                </div>
                <div className="content">
                    <div className="description">
                        Chord diagrams are commonly used to visualise{' '}
                        bi-directional flow data.
                    </div>
                    <div className="description">
                        One notable example of this kind of visualisation is{' '}
                        the BBC&rsquo;s{' '}
                        <a href="https://www.bbc.co.uk/news/business-15748696"
                           target="_blank" rel="noopener noreferrer">
                            Eurozone debt map
                        </a>.
                    </div>
                    <div className="description">
                        This demo allows you to create your own interactive{' '}
                        chord diagram by supplying spreadsheets containing{' '}
                        data resembling n x n matrices.
                    </div>
                </div>
            </section>

            <section>
                <div className="title">
                    Roadmap
                </div>
                <div className="content">
                    <div className="description">
                        Upcoming features:
                        <ul>
                            <li>
                                - Allow users to upload different types of{' '}
                                spreadsheet data. Currently the application{' '}
                                assumes spreadsheet rows are outflows and{' '}
                                columns are inflows.
                            </li>
                            <li>
                                - Allow users to change visualisation type.{' '}
                                Currently only outflows visualisations are{' '}
                                shown.
                            </li>
                            <li>
                                - Diagram labels
                            </li>
                            <li>
                                - Additional customisations e.g. changing{' '}
                                colors
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <div className="title">
                    Miscellaneous
                </div>
                <div className="content">
                    <div className="description">
                        Source code can be found{' '}
                        <a href="https://github.com/bnguyensn/app-005"
                           target="_blank" rel="noopener noreferrer">
                            here
                        </a>.
                    </div>
                    <div className="description">
                        <span style={{textDecoration: 'underline'}}>
                             Major frameworks & libraries used:
                        </span>
                        <ul>
                            <li>
                                <a href="https://reactjs.org/"
                                   target="_blank"
                                   rel="noopener noreferrer">React
                                </a> - Front-end framework
                            </li>
                            <li>
                                <a href="https://d3js.org/"
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    D3.js
                                </a> - Visualisation library
                            </li>
                            <li>
                                <a href="https://github.com/SheetJS/js-xlsx/"
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    SheetJS
                                </a> - Excel parser
                            </li>
                            <li>
                                <a href="http://expressjs.com/.com/"
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    Express
                                </a> - Server framework
                            </li>
                            <li>
                                Full list in <code>package.json</code>!
                            </li>
                        </ul>
                    </div>
                    <div className="description">
                        <span style={{textDecoration: 'underline'}}>
                            Sources of inspiration:
                        </span>
                        <ul>
                            <li>
                                <a href="https://twitter.com/mbostock"
                                   target="_blank" rel="noopener noreferrer">
                                    Mike Bostock
                                </a> - Co-creator of D3.js
                            </li>
                            <li>
                                <a href="https://twitter.com/NadiehBremer"
                                   target="_blank" rel="noopener noreferrer">
                                    Nadieh Bremer
                                </a> - Maker of beautiful web-based{' '}
                                visualisations
                            </li>
                            <li>
                                And all the awesome people and team{' '}
                                who developed the frameworks and libraries{' '}
                                involved. Much 💖!
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

        </ClickableDiv>
    )
}
