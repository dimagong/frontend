import React from "react";

import NmpTilesSelectField from "./NmpTilesSelectField";

export default {
  title: "NmpTilesSelectField",
  component: NmpTilesSelectField,
};

const options = ["Brad Powar", "Richard Philips"].map((value) => ({ label: value, value }));

export const Base = (props) => {
  const [value, setValue] = React.useState(null);
  const [tiles, setTiles] = React.useState([]);

  const addTile = React.useCallback((tile) => setTiles((prev) => [...prev, tile]), []);
  const removeTile = React.useCallback((toRemove) => setTiles((prev) => prev.filter((tile) => tile !== toRemove)), []);

  const notAddedOptions = React.useMemo(() => options.filter(({ value }) => !tiles.includes(value)), [tiles]);

  return (
    <NmpTilesSelectField
      {...props}
      value={value}
      onChange={setValue}
      options={notAddedOptions}
      tiles={tiles}
      onTileAdd={addTile}
      onTileRemove={removeTile}
    />
  );
};

Base.args = {
  name: "roles",
  tileColor: "primary",
};
