import React from 'react';

import WidgetDataContext from './DataContext';

/*
   Proxies data from this context into Component props
*/
const withPropHandler = (Component, defaults) => {
  class WithPropHandler extends React.Component {
    
    dataHandler = data => {
      const { forwardedRef, ...props } = this.props;
      const { onChangeData = () => {}, ...restData } = data;
      const allData = Object.assign({}, defaults, restData, props);

      return (
        <Component
          ref={ forwardedRef }
          /* Save and get data to/from specific id */
          onChangeData={ onChangeData }
          { ...allData }
        />
      )
    }

    render() {
      return (
        <WidgetDataContext.Consumer>
          { this.dataHandler }
        </WidgetDataContext.Consumer>
      )
    }
  }

  // Return wrapper respecting ref
  const forwarded = React.forwardRef( (props, ref) => {
    return <WithPropHandler { ...props } forwardedRef={ ref } />
  });

  forwarded.propTypes = Component.propTypes;
  forwarded.defaultProps = Component.defaultProps;

  return forwarded;
}

export default withPropHandler;
