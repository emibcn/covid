import React from "react";

import SvgIcon from "@material-ui/core/SvgIcon";

import { ReactComponent as BcnIcon } from "./bcn.svg";

const Icon = (props) => (
  <svg {...props}>
    <BcnIcon />
  </svg>
);
const BcnLogo = (props) => <SvgIcon component={Icon} {...props} />;

export default BcnLogo;
