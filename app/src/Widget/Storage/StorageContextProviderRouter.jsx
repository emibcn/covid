import React from "react";
import { PropTypes } from "prop-types";
import { Route, Switch } from "react-router-dom";

import WidgetStorageContext from "./StorageContext";
import withStorageHandler from "./withStorageHandler";

/*
   Context provider using React Route as data source for Widgets params
*/
class RouterProvider extends React.Component {
  // History change listener
  unlisten = () => {};

  constructor(props) {
    super(props);
    this.history = props.history;
  }

  historyPush = (data, replace = false) => {
    const newPath = this.props.paramsToString(data);

    // Only PUSH or REPLACE if something have to change
    if (this.history.location.pathname !== newPath) {
      if (!replace) {
        this.history.push(newPath + this.history.location.hash);
      } else {
        this.history.replace(newPath + this.history.location.hash);
      }
    }
  };

  handleHistoryChange = (location, action) => {
    // Do nothing when change is made by us
    if (action !== "POP") {
      return;
    }
  };

  componentDidMount = () => {
    // Register history change event listener
    this.unlisten = this.history.listen(this.handleHistoryChange);
    // Check if data from localStorage is better
    if (
      !this.props.params.widgets.length &&
      this.props.data.widgets &&
      this.props.data.widgets.length
    ) {
      this.historyPush(this.props.data, true);
    }
  };

  componentWillUnmount = () => {
    // Unregister history change event listener
    this.unlisten();
  };

  // Save data into location
  onChangeData = (data) => {
    this.historyPush({ ...data }, true);
    this.props.onChangeData({ ...data });
  };

  // Render the provider and the children
  render() {
    const {
      children,
      data,
      params,
      paramsFilter,
      paramsToString,
      history,
      onChangeData,
      ...props
    } = this.props;

    return (
      <WidgetStorageContext.Provider
        value={{
          onChangeData: this.onChangeData,
          ...props,
          ...data,
          ...params,
        }}
      >
        {children}
      </WidgetStorageContext.Provider>
    );
  }
}

RouterProvider.propTypes = {
  // Receive data and onChangeData from localStorage
  data: PropTypes.object.isRequired,
  onChangeData: PropTypes.func.isRequired,
  // Receive params and history from browser location/Router
  params: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

// Proxy Route data into child props provider
const RouterProviderWithSwitch = (props) => {
  const { pathFilter, paramsFilter, paramsToString, ...restProps } = props;
  return (
    <Switch>
      <Route
        path={pathFilter}
        render={(propsRoute) => {
          const {
            match: { params },
            history,
          } = propsRoute;
          const processedParams = paramsFilter(params);
          return (
            <RouterProvider
              {...{ paramsFilter, paramsToString, history }}
              {...restProps}
              params={processedParams}
            />
          );
        }}
      />
    </Switch>
  );
};

RouterProviderWithSwitch.propTypes = {
  // How to handle hash storage
  pathFilter: PropTypes.string.isRequired,
  paramsFilter: PropTypes.func.isRequired,
  paramsToString: PropTypes.func.isRequired,
};

// Consume localStorage storage provider
const RouterProviderWithSwitchWithStorageHandler = withStorageHandler(
  RouterProviderWithSwitch,
  { data: { widgets: { type: "map" } } } // TODO: default
);

export default RouterProviderWithSwitchWithStorageHandler;
