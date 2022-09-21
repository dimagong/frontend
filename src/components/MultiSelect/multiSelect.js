import chroma from "chroma-js";
import { Plus } from "react-feather";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectGroups } from "app/selectors/groupSelector";

import NmpSelect, { components } from "components/nmp/DeprecatedNmpSelect";

import { normalizeNotNestedGroups } from "utility/select/prepareSelectData";
import { prepareNotNestedSelectOptions } from "utility/select/prepareSelectData";

const { getGroupsRequest } = appSlice.actions;

const colorMultiSelect = "#007bff";

const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    border: 0,
    // This line disable the blue border
    boxShadow: "none",
    minHeight: "auto",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = data.color ? chroma(data.color) : colorMultiSelect;
    return {
      ...styles,
      backgroundColor: isDisabled ? null : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
      color: isDisabled ? "#ccc" : isSelected ? (chroma.contrast(color, "white") > 2 ? "white" : "black") : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled && (isSelected ? data.color : "white"),
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = data.color ? chroma(data.color) : colorMultiSelect;
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data, isDisabled }) => ({
    ...styles,
    color: data.color ? data.color : colorMultiSelect,
    paddingRight: isDisabled ? "6px" : styles["paddingRight"],
    ":hover": {
      cursor: "pointer",
      backgroundColor: data.color ? data.color : colorMultiSelect,
      color: "white",
    },
  }),
  multiValueRemove: (styles, { data, isDisabled }) => ({
    ...styles,
    display: isDisabled ? "none" : styles["display"],
    color: data.color,
    ":hover": {
      backgroundColor: data.color ? data.color : colorMultiSelect,
      color: "white",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: 0,
    "margin-left": "-2px",
  }),
  indicatorSeparator: (styles) => ({ display: "none" }),
};

export const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        {/* <FontAwesomeIcon icon={props.selectProps.menuIsOpen ? "caret-up" : "caret-down"}/> */}
        <Plus className="plus-select" size={15} />
      </components.DropdownIndicator>
    )
  );
};

export const MultiSelect = ({ groups: selectedGroups, setGroups, single, noDropdownIndicator = false }) => {
  const initGroups = useSelector(selectGroups) || [];
  // const groups = prepareSelectOptions(initGroups);
  const groups = prepareNotNestedSelectOptions(initGroups);
  const dispatch = useDispatch();

  // TODO: remove choosen options for select options
  const filtredSelectOptions = () => {
    return groups.filter(
      (groupSelect) =>
        !selectedGroups.some(
          (group) => group.value.group_id === groupSelect.value.group_id && group.value.type === groupSelect.value.type
        )
    );
  };

  useEffect(() => {
    !groups.length && dispatch(getGroupsRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // TODO: set groups in to parrent component
  const onSelectGroupsChange = (values) => {
    if (single) {
      values = [values];
    }
    values
      ? dispatch(
          setGroups(
            normalizeNotNestedGroups(initGroups).filter((group) => values.some((value) => value.label === group.name))
          )
        )
      : dispatch(setGroups([]));
  };
  return (
    <div className="d-flex mb-1">
      <div className="font-weight-bold column-sizing" style={{ padding: 4 }}>
        {single ? "Organization" : "Organisations"}
      </div>
      <div className="w-100">
        <NmpSelect
          components={{ DropdownIndicator: noDropdownIndicator ? null : DropdownIndicator }}
          multiple={!single}
          clearable={false}
          maxMenuHeight={200}
          styles={colourStyles}
          value={selectedGroups}
          options={filtredSelectOptions()}
          onChange={(values) => {
            onSelectGroupsChange(values);
          }}
          classNamePrefix="select"
          id="languages"
        />
      </div>
    </div>
  );
};

export default MultiSelect;
