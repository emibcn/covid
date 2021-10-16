import React from "react";
import PropTypes from "prop-types";

import ListHeader from "./ListHeader";
import MenuAddWidget from "./MenuAddWidget";
import WidgetsTypes from "./Widgets";
import SortableWidgetContainer from "./SortableWidgetContainer";

import Throtle from "../Throtle";
import DateSlider from "./DateSlider";
import Loading from "../Loading";

import { withIndex as withMapsIndex } from "../Backend/Maps/context";
import { WidgetStorageContextProvider, withStorageHandler } from "./Storage";

// GUID generator: used to create unique temporal IDs for widgets
const S4 = () =>
  (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
const guidGenerator = () =>
  "a-" +
  S4() +
  S4() +
  "-" +
  S4() +
  "-" +
  S4() +
  "-" +
  S4() +
  "-" +
  S4() +
  S4() +
  S4();

// Renders widgets list
// - Manages days list (using backend) and currently selected Date with a Slider
// - Receives managed plugins params from props (with storage context providers and consumer)
// - Receives Widgets param modification events and calls parents param event
//   handlers callbacks with processed data:
//   - Add (from MenuAddWidget)
//   - Edit (from widgets)
//   - Remove (from widgets)
//   - Reorder (from SortableWidgetContainer)
// - Blindly (with `payload`) handles different types of widgets depending on passed/saved
//   params from URL and localStorage
class WidgetsList extends React.PureComponent {
  // Managed data: days & currently selected day
  state = {
    currentDate: null,
    widgets: [],
  };

  // Widgets list temporal IDs
  // Used to maintain widget uniqueness during a session
  widgetsIds = [];

  // Used in the slider to prevent blocking the UI
  // with excessive calls on mouse move
  throtle = new Throtle();

  updateWidgets = () => {
    // Ensure a unique and constant ID for each widget
    const length = this.widgetsIds.length;
    if (length < this.props.widgets.length) {
      this.widgetsIds = this.props.widgets.map((w, index) =>
        index < length ? this.widgetsIds[index] : guidGenerator()
      );
    }

    // Generate a cached (in state) madurated list of widgets
    const widgets = this.props.widgets.map(({ type, payload }, index) => ({
      id: this.widgetsIds[index],
      Component: WidgetsTypes.find((w) => w.key === type).Component,
      ...{ payload },
    }));

    this.setState({ widgets });
  };

  componentDidMount() {
    const { days } = this.props;
    this.updateWidgets();
    this.setState({ currentDate: days.length - 1 });
  }

  // Cleanup side effects
  componentWillUnmount() {
    // Cancel possible throtle timer
    this.throtle.clear();
  }

  componentDidUpdate(prevProps, prevState) {
    const { days: daysOld } = prevProps;
    const { days } = this.props;

    if (daysOld !== days) {
      const { currentDate } = this.state;
      const isLast =
        !currentDate || !daysOld || currentDate === daysOld.length - 1;

      // If we were on last `days` item, go to the new last
      if (isLast) {
        this.setState({
          currentDate: days.length - 1,
        });
      }
    }

    if (prevProps.widgets !== this.props.widgets) {
      this.updateWidgets();
    }
  }

  // Slider helpers
  onSetDate = (event, currentDate) =>
    this.throtle.run(false, 10, () => this.setState({ currentDate }));

  // Adds a new default widget to the list
  onAdd = (widgetType) => {
    const widgets = [...this.props.widgets];
    widgets.push({ type: widgetType ?? "map" });
    return this.props.onChangeData({ widgets });
  };

  // Handle onRemove event from widget
  // Uses `this.widgetsIDs` for widget identification
  // Calls parent' onChangeData to save the data
  onRemove = (id) => {
    const widgets = this.props.widgets.filter(
      (w, index) => this.widgetsIds[index] !== id
    );
    this.widgetsIds = this.widgetsIds.filter((idElement) => idElement !== id);
    return this.props.onChangeData({ widgets });
  };

  // Handle onChangeData event from widget
  // Calls parent' onChangeData to save the data
  onChangeData = (id, data) => {
    const { widgets } = this.props;
    const widgetsNew = widgets.map((w, i) => ({
      ...w,
      ...(id === this.widgetsIds[i] ? { payload: data } : {}),
    }));
    return this.props.onChangeData({ widgets: widgetsNew });
  };

  // Handle widgets reordering
  // Takes care of both `this.widgetsIds` and `this.props.widgets`
  onReorder = (oldIndex, newIndex) => {
    // Reorder ID
    const id = this.widgetsIds[oldIndex];
    this.widgetsIds.splice(oldIndex, 1);
    this.widgetsIds.splice(newIndex, 0, id);

    // Reorder data (keep props immutable)
    // Use `widgets.filter` to clone original array
    const { widgets } = this.props;
    const widget = widgets[oldIndex];
    const widgetsNew = widgets.filter((w, index) => index !== oldIndex);
    widgetsNew.splice(newIndex, 0, widget);

    // Save data
    return this.props.onChangeData({ widgets: widgetsNew });
  };

  render() {
    const { days } = this.props;
    const { widgets, currentDate } = this.state;

    if (currentDate === null) {
      return <Loading />;
    }

    return (
      <>
        <ListHeader>
          {/* Add an item */}
          <MenuAddWidget onAdd={this.onAdd} options={WidgetsTypes} />

          {/* Days display & Current manager */}
          <DateSlider
            days={days}
            current={currentDate || 0}
            onSetDate={this.onSetDate}
          />
        </ListHeader>

        {/* Container that displays the widgets */}
        <SortableWidgetContainer
          days={days}
          indexValues={currentDate}
          onChangeData={this.onChangeData}
          onRemove={this.onRemove}
          onReorder={this.onReorder}
          widgets={widgets}
        />
      </>
    );
  }
}

WidgetsList.propTypes = {
  widgets: PropTypes.array.isRequired,
  days: PropTypes.array.isRequired,
  onChangeData: PropTypes.func.isRequired,
};

// withStorageHandler: Handle params from storage providers (route + localStorage) into props
// withMapsIndex: Add `days` prop to use maps backend index (days)
const WidgetsListWithHOCs = withStorageHandler(withMapsIndex(WidgetsList));

// Manage some context providers details:
// - pathFilter: How to split `location` (<Router> `path` prop)
// - paramsFilter: Parse `location` parts defined ^
// - paramsToString: Parse back a JS object into a `location` path
const WidgetsListWithStorageContextProviders = (props) => (
  <WidgetStorageContextProvider
    pathFilter={"/:widgets*"}
    paramsFilter={(params) => {
      const { widgets } = params;
      let widgetsParsed;

      try {
        widgetsParsed = widgets
          .split("/")
          .map((w) => JSON.parse(decodeURIComponent(w)));
      } catch (err) {
        widgetsParsed = [];
      }

      return Object.assign({}, props, {
        widgets: widgetsParsed,
      });
    }}
    paramsToString={(params) => {
      const widgets = params.widgets
        .map((w) =>
          encodeURIComponent(
            JSON.stringify({
              type: w.type,
              payload: w.payload,
            })
          )
        )
        .join("/");
      return `/${widgets}`;
    }}
  >
    <WidgetsListWithHOCs {...props} />
  </WidgetStorageContextProvider>
);

export default WidgetsListWithStorageContextProviders;
