import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobeEurope as faMap,
  faChartArea as faChart,
} from "@fortawesome/free-solid-svg-icons";

import MapWidget from "./Map";
import ChartWidget from "./Chart";
import BcnWidget from "./Bcn";

import BcnLogo from "./Bcn/BcnLogo";

const WidgetsTypes = [
  {
    key: "map",
    Component: MapWidget,
    icon: <FontAwesomeIcon icon={faMap} />,
    name: "Map",
  },
  {
    key: "chart",
    Component: ChartWidget,
    icon: <FontAwesomeIcon icon={faChart} />,
    name: "Chart",
  },
  {
    key: "bcn",
    Component: BcnWidget,
    icon: <BcnLogo />,
    name: "Barcelona Chart",
  },
];

export default WidgetsTypes;
