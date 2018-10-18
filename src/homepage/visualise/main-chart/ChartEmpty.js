// @flow

import * as React from 'react';
import {Link} from '@reach/router';

export default function EmptyChart() {
    return (
        <div id="main-chart-empty">
            No data available. Please either provide data or generate{' '}
            preset data using the appropriate options in the {' '}
            <Link>DATA</Link> tab.
        </div>
    )
}
