import React from "react";

import { NmpSelect } from "./NmpSelect";

export default {
  title: "Nmp/Select",
  component: NmpSelect,
};

const Template = (props) => <NmpSelect {...props} style={{ width: "100%" }} />;

export const Base = Template.bind({});
Base.args = {
  options: Array(4)
    .fill(null)
    .map((_, index) => `option ${index}`),
  placeholder: "Select an option",
};

export const Multiple = Template.bind({});
Multiple.args = {
  mode: "multiple",
  options: Array(30)
    .fill(null)
    .map((_, index) => `option ${index}`),
  placeholder: "Select an option",
};
