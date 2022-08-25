import React from "react";

import NmpTile from "./NmpTile";

export default {
  title: "NMPTile",
  component: NmpTile,
  argTypes: {
    size: {
      options: ["", "sm", "lg"],
      control: "select",
    },
  },
};

export const Base = (props) => {
  return <NmpTile {...props}>Richard Philips</NmpTile>;
};

Base.args = {
  size: "",
  color: "primary",
  close: false,
  pill: false,
};
