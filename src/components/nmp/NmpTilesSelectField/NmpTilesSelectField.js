import "./styles.scss";

import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Plus } from "react-feather";

import NmpTile from "../NmpTile";
import NmpButton from "../NmpButton";
import SelectField from "../SelectField";

const NmpTilesSelectField = (props) => {
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

    innerChildren,
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
      <NmpTile
        className="nmp-tiles-select-field__tile"
        color={tileColor}
        close
        size="sm"
        onClose={onTileClose(tile)}
        key={`nmp-select-tile-${index}`}
      >
        {tile.label}
      </NmpTile>
    );
  };

  return (
    <SelectField
      label={label}
      name={name}
      value={selectValue}
      onChange={setSelectValue}
      options={privateOptions}
      errors={errors}
      valid={valid}
      invalid={invalid}
      placeholder={placeholder}
      innerChildren={innerChildren}
      {...attrs}
    >
      {({ label, select, error }) => (
        <>
          {label}

          <div className="d-flex">
            <div className="pr-1 full-width">{select}</div>

            <div className="nmp-tiles-select-field__adder-wrap d-flex justify-content-end">
              <NmpButton
                className="nmp-tiles-select-field__adder d-flex align-items-center justify-content-center p-0"
                onClick={onAdderClick}
                disabled={!selectValue}
                icon={<Plus />}
              />
            </div>
          </div>

          <div className="nmp-tiles-select-field__tiles mt-2">{tiles.map(renderTile)}</div>

          {error}
        </>
      )}
    </SelectField>
  );
};

NmpTilesSelectField.propTypes = {
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

export default NmpTilesSelectField;
