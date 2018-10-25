// @flow

import * as React from 'react';
import {Link} from '@reach/router';

import Page from '../components/Page';

import './intro.css';

export default function Intro() {
    return (
        <Page id="intro">
            <div className="title">
                CHORD DIAGRAM TECH DEMO
            </div>
            <div className="subtitle">
                A D3.js / SheetJS / React tech demo by Binh Nguyen
            </div>
            <div className="description delay-1">
                A chord diagram is commonly used to visualise{' '}
                bi-directional flow data.
            </div>
            <div className="description delay-2">
                One notable example of this kind of visualisation is the{' '}
                BBC&rsquo;s{' '}
                <a href="https://www.bbc.co.uk/news/business-15748696"
                   target="_blank" rel="noopener noreferrer">
                    Eurozone debt map
                </a>.
            </div>
            <div className="description delay-3">
                This demo allows you to create your own interactive chord{' '}
                diagram.{' '}
                Please head over to the{' '}
                <Link to="/visualise">VISUALISE</Link> tab.
            </div>
        </Page>
    )
}
