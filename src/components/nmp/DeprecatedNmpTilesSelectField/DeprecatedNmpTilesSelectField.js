import "./styles.scss";

import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Plus } from "react-feather";

import DeprecatedNmpTile from "../DeprecatedNmpTile";
import DeprecatedNmpButton from "../DeprecatedNmpButton";
import DeprecatedNmpSelect from "../DeprecatedNmpSelect";

const DeprecatedNmpTilesSelectField = (props) => {
  const {
    label,
    name,
    placeholder,

    value: tiles = [],
    onChange = _.noop,
    options,

    errors,
    valid,
    invalid,

    tile: tileSlot,
    tileColor,

    children,
    ...attrs
  } = props;

  const [selectValue, setSelectValue] = React.useState(null);

  const parsedTiles = React.useMemo(() => tiles.map(_.get("value")), [tiles]);

  const privateOptions = React.useMemo(() => {
    return options.filter(({ value }) => !parsedTiles.includes(value));
  }, [options, parsedTiles]);

  const onAdderClick = React.useCallback(() => {
    if (!selectValue?.value) {
      throw new Error("Unable add nullable value by to selected tiles.");
    }

    const newTiles = [...tiles, selectValue];

    onChange(newTiles);
    setSelectValue(null);
  }, [onChange, selectValue, tiles]);

  const onTileClose = React.useCallback(
    (toRemove) => () => {
      const newTiles = tiles.filter((tile) => tile.value !== toRemove.value);

      onChange(newTiles);
    },
    [onChange, tiles]
  );

  const renderTile = (tile, index) => {
    if (tileSlot) {
      return tileSlot({ onClose: onTileClose(tile), tile, index });
    }

    return (
      <DeprecatedNmpTile
        className="nmp-tiles-select-field__tile"
        color={tileColor}
        close
        size="sm"
        onClose={onTileClose(tile)}
        key={`nmp-select-tile-${index}`}
      >
        {tile.label}
      </DeprecatedNmpTile>
    );
  };

  return (
    <>
      {label}

      <div className="d-flex">
        <div className="pr-1 full-width">
          <DeprecatedNmpSelect
            name={name}
            value={selectValue}
            onChange={setSelectValue}
            options={privateOptions}
            valid={valid}
            placeholder={placeholder}
            {...attrs}
          />
        </div>

        <div className="nmp-tiles-select-field__adder-wrap d-flex justify-content-end">
          <DeprecatedNmpButton
            className="nmp-tiles-select-field__adder d-flex align-items-center justify-content-center p-0"
            onClick={onAdderClick}
            disabled={!selectValue}
            icon={<Plus />}
          />
        </div>
      </div>

      <div className="nmp-tiles-select-field__tiles mt-2">{tiles.map(renderTile)}</div>
    </>
  );
};

DeprecatedNmpTilesSelectField.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), label: PropTypes.string })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.any })).isRequired,

  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),

  placeholder: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  tile: PropTypes.func,
  tileColor: PropTypes.string,

  innerChildren: PropTypes.node,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default DeprecatedNmpTilesSelectField;
