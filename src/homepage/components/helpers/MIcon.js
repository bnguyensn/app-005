/**
 * MaterialIcon
 *
 * A wrapper created to use Google's material icon.
 *
 * Usage: <MIcon icon="..." />
 * */

// @flow

import React from 'react';

import './micon.css';

/** ********** GOOGLE'S MATERIAL ICON ********** **/

export function MIcon(props: {icon: string}) {
    return (
        <span className="micon-container">
            <i className="material-icons">{props.icon}</i>
        </span>
    )
}

/** ********** SVG MATERIAL ICON ********** **/

/** Non-link version **/

export function MIconSVG(props: {svgSize?: string, svgD: string | string[], svgFill: string}) {
    let pathElement;
    if (Array.isArray(props.svgD)) {
        pathElement = props.svgD.map((d) =>
            <path key={d.slice(5)} d={d} fill={props.svgFill} />
        );
    } else {
        pathElement = <path d={props.svgD} fill={props.svgFill} />;
    }

    return (
        <span className="micon-container">
            <svg className={props.svgSize} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {pathElement}
            </svg>
        </span>
    )
}

MIconSVG.defaultProps = {
    svgSize: 'medium'
};

/** Link version **/

export function MIconSVGLink(props: {extraClsNme: string, href: string, svgD: string, svgFill: string}) {
    return (
        <a className={props.extraClsNme} href={props.href}
           target="_blank" rel="noopener noreferrer">
            <MIconSVG svgD={props.svgD} svgFill={props.svgFill} />
        </a>
    )
}
