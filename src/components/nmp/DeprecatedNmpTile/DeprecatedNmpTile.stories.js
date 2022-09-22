import React from "react";

import DeprecatedNmpTile from "./DeprecatedNmpTile";

export default {
  title: "NMPTile",
  component: DeprecatedNmpTile,
  argTypes: {
    size: {
      options: ["", "sm", "lg"],
      control: "select",
    },
  },
};

export const Base = (props) => {
  return <DeprecatedNmpTile {...props}>Richard Philips</DeprecatedNmpTile>;
};

Base.args = {
  size: "",
  color: "primary",
  close: false,
  pill: false,
};
