import React from "react";

import Storage from "react-simple-storage";

import Loading from "../../Loading";
import WidgetStorageContext from "./StorageContext";

/*
   Context provider using localStorage as data source for Widgets params
*/
class LocalStorageProvider extends React.Component {
  state = {
    initializing: true,
    data: {},
  };

  onChangeData = (data) => {
    this.setState({ data });
  };

  stopInitializing = () => {
    this.setState({ initializing: false });
  };

  render() {
    const { children, ...props } = this.props;
    const { initializing, data } = this.state;

    return (
      <>
        {/* Persistent state saver into localStorage, only on window close */}
        <Storage
          parent={this}
          prefix="LocalStorageProvider"
          blacklist={["initializing"]}
          onParentStateHydrated={this.stopInitializing}
        />

        {initializing ? (
          <Loading />
        ) : (
          <WidgetStorageContext.Provider
            value={{
              onChangeData: this.onChangeData,
              ...props,
              data,
            }}
          >
            {children}
          </WidgetStorageContext.Provider>
        )}
      </>
    );
  }
}

LocalStorageProvider.propTypes = {};

export default LocalStorageProvider;
