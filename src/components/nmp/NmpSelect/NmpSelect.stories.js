import React from "react";

import NmpSelect from "./NmpSelect";

export default {
  title: "NmpSelect",
  component: NmpSelect,
};

const stringToOption = (label) => ({ label, value: { name: label } });

const options = ["Brad Powar", "Richard Philips"].map(stringToOption);

const Template = (props) => {
  const ref = React.useRef(null);
  const [value, setValue] = React.useState(null);

  React.useEffect(() => console.log("forwarding ref", ref), []);

  return <NmpSelect {...props} value={value} options={options} onChange={setValue} />;
};

const defaultArguments = {
  valid: void 0,
  disabled: false,
  placeholder: void 0,
  searchable: false,
};

export const Base = Template.bind();

Base.args = defaultArguments;

export const Multiple = Template.bind();

Multiple.args = {
  ...defaultArguments,
  multiple: true,
};
