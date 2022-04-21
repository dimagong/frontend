import React from "react";

import NmpTilesSelectField from "./NmpTilesSelectField";

export default {
  title: "NmpTilesSelectField",
  component: NmpTilesSelectField,
};

const options = ["Brad Powar", "Brad Powar", "Richard Philips"].map((value, index) => ({
  label: value,
  value: { id: index, name: value },
}));

export const Base = (props) => {
  const [tiles, setTiles] = React.useState([]);

  return <NmpTilesSelectField {...props} value={tiles} onChange={setTiles} options={options} />;
};

Base.args = {
  tileColor: "primary",
};
