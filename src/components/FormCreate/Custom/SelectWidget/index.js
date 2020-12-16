import React from 'react';
import { Input } from 'reactstrap';
import Select from 'react-select'
import './styles.scss'
import FieldLabel from '../FieldLabel'

const colourStyles = {

  option: (styles, { isFocused, isSelected, ...rest }) => {

    return {
      ...styles,
      backgroundColor: isSelected
          ? "#7367f0"
          : isFocused
            ? "rgba(0, 0, 0, 0.05)"
            : null,
      cursor: 'pointer',

      ':active': {
        ...styles[':active'],
        backgroundColor: '#7367f0',
        color: "white",
      },
    };
  },
  control: (styles, { selectProps }) => ({
    ...styles,
    backgroundColor: "#eee",
    border: '0 !important',
    borderBottom: "1px solid #707070!important",
    // This line disable the blue border
    boxShadow: '0 !important',
    borderRadius: 0,
    '&:hover': {
      border: '0 !important',
      borderBottom: "1px solid #707070!important",
    },
    cursor: 'pointer',
    padding: selectProps.isMulti ? "0 0 8px 4px" : "0 0 5px 1px",
  }),
  singleValue: styles => ({
    ...styles,
    color: "#707070",
  }),
  multiValueLabel: styles => ({
    ...styles,
    color: "#707070",
  }),
  multiValueRemove: styles => ({
    ...styles,
    '&:hover': {
      background: "transparent",
      color: "inherit",
    },
  }),
}
const SelectWidget = (props) => {

  const handleChange = (values ) => {
    props.onChange(values || [])
  }

  return (
    <div>
      <FieldLabel label={props.schema.title} />
      <Select
        isDisabled={props.disabled}
        styles={colourStyles}
        isMulti={props.multiple}
        name="colors"
        value={props.value}
        onChange={handleChange}
        options={props.options.enumOptions}
        className="React"
        classNamePrefix="select"
        placeholder={"Select an option"}
      />
    </div>
  )
}

export default SelectWidget;
