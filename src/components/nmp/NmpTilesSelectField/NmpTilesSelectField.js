import "./styles.scss";

import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Plus } from "react-feather";
import { Col, Row } from "reactstrap";

import NmpTile from "../NmpTile";
import NmpButton from "../NmpButton";
import SelectField from "../SelectField";

const NmpTilesSelectField = (props) => {
  const {
    label,
    name,
    value,
    options,
    errors,
    valid,
    invalid,
    placeholder,
    tiles,
    tileColor,
    onTileAdd = _.noop,
    onTileRemove = _.noop,
    onChange = _.noop,
    innerChildren,
    children,
    ...attrs
  } = props;

  const onAdderClick = React.useCallback(() => {
    if (!value?.value) {
      throw new Error("It's impossible to add a nullable value.");
    }

    onTileAdd(value.value);
    // reset value
    onChange(null);
  }, [onChange, onTileAdd, value]);

  const onTileClose = React.useCallback((tile) => () => onTileRemove(tile), [onTileRemove]);

  return (
    <SelectField
      label={label}
      name={name}
      value={value}
      options={options}
      errors={errors}
      valid={valid}
      invalid={invalid}
      placeholder={placeholder}
      onChange={onChange}
      innerChildren={innerChildren}
      {...attrs}
    >
      {({ label, select, error }) => (
        <>
          {label}

          <div className="d-flex">
            <div className="width-90-per pr-1">{select}</div>
            <div className="width-10-per d-flex justify-content-end">
              <NmpButton
                className="nmp-tiles-select-field__adder d-flex align-items-center justify-content-center p-0"
                onClick={onAdderClick}
                disabled={!value}
                icon={<Plus />}
              />
            </div>
          </div>

          <div className="nmp-tiles-select-field__tiles mt-2">
            {tiles.map((tile, index) => (
              <NmpTile className="nmp-tiles-select-field__tile" color={tileColor} close onClose={onTileClose(tile)} key={tile}>
                {tile}
              </NmpTile>
            ))}
          </div>
          {error}
        </>
      )}
    </SelectField>
  );
};

NmpTilesSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({ label: PropTypes.string, value: PropTypes.any }),
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.any })).isRequired,

  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),

  placeholder: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  onChange: PropTypes.func.isRequired,

  innerChildren: PropTypes.node,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

  tileColor: PropTypes.string,
  tiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTileAdd: PropTypes.func.isRequired,
  onTileRemove: PropTypes.func.isRequired,
};

export default NmpTilesSelectField;
