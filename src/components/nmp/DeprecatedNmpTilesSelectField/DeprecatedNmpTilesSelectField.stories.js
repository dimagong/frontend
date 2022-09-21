import React from "react";

import DeprecatedNmpTilesSelectField from "./DeprecatedNmpTilesSelectField";

export default {
  title: "NmpTilesSelectField",
  component: DeprecatedNmpTilesSelectField,
};

const options = ["Brad Powar", "Brad Powar", "Richard Philips"].map((value, index) => ({
  label: value,
  value: { id: index, name: value },
}));

export const Base = (props) => {
  const [tiles, setTiles] = React.useState([]);

  return <DeprecatedNmpTilesSelectField {...props} value={tiles} onChange={setTiles} options={options} />;
};

Base.args = {
  tileColor: "primary",
};
