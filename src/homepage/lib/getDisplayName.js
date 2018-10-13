// @flow

/**
 * Utility function for React HOCs
 * */
export default function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}
