import React from "react";

import WidgetStorageContext from "./StorageContext";

/*
   Proxies data from this context into Component props
*/
const withStorageHandler = (Component, defaults) => {
  class WithStorageHandler extends React.Component {
    storageHandler = (data) => {
      const { forwardedRef, ...props } = this.props;
      const { onChangeData = () => {}, ...restData } = data;
      const allData = Object.assign({}, defaults, restData, props);

      return (
        <Component
          ref={forwardedRef}
          /* Save and get data to/from specific id */
          onChangeData={onChangeData}
          {...allData}
        />
      );
    };

    render() {
      return (
        <WidgetStorageContext.Consumer>
          {this.storageHandler}
        </WidgetStorageContext.Consumer>
      );
    }
  }

  // Return wrapper respecting ref
  const forwarded = React.forwardRef((props, ref) => (
    <WithStorageHandler {...props} forwardedRef={ref} />
  ));

  forwarded.propTypes = Component.propTypes;
  forwarded.defaultProps = Component.defaultProps;

  return forwarded;
};

export default withStorageHandler;
