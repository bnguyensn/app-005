// @flow

import * as React from 'react';

import './loading.css';

export default function Loading() {
    return (
        <div className="loading">
            <div className="loading-text">LOADING...PLEASE WAIT</div>
            <div className="loader" />
        </div>
    )
}
