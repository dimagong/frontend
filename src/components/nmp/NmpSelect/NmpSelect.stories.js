import React from "react";

import NmpSelect from "./NmpSelect";

export default {
  title: "NmpSelect",
  component: NmpSelect,
};

const options = ["Brad Powar", "Richard Philips"].map((label, index) => ({ label, value: { name: label } }));

export const Base = (props) => {
  const [value, setValue] = React.useState(null);

  return <NmpSelect {...props} value={value} options={options} onChange={setValue} />;
};

Base.args = {
  valid: void 0,
  disabled: false,
  placeholder: void 0,
};
