import "./styles.scss";

import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Plus } from "react-feather";

import NmpTile from "../NmpTile";
import NmpButton from "../NmpButton";
import NmpSelect from "../NmpSelect";

/*
// ToDo: Reuse NmpSelect and code below to refactor
import { components } from "react-select";
import { stopAndPrevent } from "utility/event-decorators";

const SelectValuesContainer = ({ isDisabled, getValue, ...restProps }) => {
  const { getOptionValue, formatOptionLabel, removeValue } = restProps.selectProps;

  const getValueLabel = (opt) => formatOptionLabel?.(opt, "value") || opt.label;
  const getKey = (opt, index) => `${getOptionValue(opt)}-${index}`;

  const toMultiValue = (option, index) => {
    return (
      <components.MultiValue
        getValue={getValue}
        {...restProps}
        components={{
          Container: components.MultiValueContainer,
          Label: components.MultiValueLabel,
          Remove: components.MultiValueRemove,
        }}
        isDisabled={isDisabled}
        key={getKey(option, index)}
        index={index}
        removeProps={{
          onClick: () => removeValue(option),
          onTouchEnd: () => removeValue(option),
          onMouseDown: (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
        }}
        data={option}
      >
        {getValueLabel(option)}
      </components.MultiValue>
    );
  };

  return (
    <div
      className="align-items-start"
      style={{ margin: ".5rem 0", display: "flex", flexFlow: "row wrap", border: "1px solid #ccc", minHeight: "80px" }}
    >
      {getValue().map(toMultiValue)}
    </div>
  );
};

const SelectContainer = ({ isFocused, innerProps, className, children, ...restProps }) => {
  const selectContainerProps = { ...restProps };

  return (
    <components.SelectContainer
      className={className}
      innerProps={innerProps}
      isFocused={isFocused}
      {...selectContainerProps}
    >
      {children}
      <SelectValuesContainer {...restProps} />
    </components.SelectContainer>
  );
};

const getMultiValueContainer = ({ selectRef }) => {
  const MultiValueContainer = ({ data }) => {
    const clickHandler = React.useCallback(() => selectRef.current.select.removeValue(data), [data]);

    return (
      <div onClick={clickHandler} onMouseDown={stopAndPrevent()}>
        {data.label}
      </div>
    );
  };

  return MultiValueContainer;
};
*/

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
    <>
      {label}

      <div className="d-flex">
        <div className="pr-1 full-width">
          <NmpSelect
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
          <NmpButton
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
