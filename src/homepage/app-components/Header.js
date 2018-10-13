// @flow

import * as React from 'react';
import {Link} from '@reach/router';

import './header.css';

const isActive = ({isCurrent}) => isCurrent
    ? {className: 'nav-link active'}
    : null;

const NavLink = props => (
    <Link className="nav-link"
          getProps={isActive}
          {...props} />
);

export default function Header() {
    return (
        <nav id="header">
            <NavLink to="/">INTRO</NavLink>
            <NavLink to="/data">DATA</NavLink>
            <NavLink id="nav-link-visualise" to="/visualise">VISUALISE</NavLink>
        </nav>
    )
}
