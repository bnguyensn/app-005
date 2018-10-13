import * as React from 'react';

const withButtonFunctionalies = WrappedComponent => (
    class WithButtonFunctionalities extends React.PureComponent {
        render() {
            return (
                <WrappedComponent
                    {...this.props} />
            )
        }
    }
);

export default withButtonFunctionalies
