import chroma from "chroma-js"

export const colorMultiSelect = '#007bff'; //#7367f0


export const colourStyles = {
    control: styles => ({
      ...styles,
      backgroundColor: "white",
      border: 0,
      // This line disable the blue border
      boxShadow: "none",
      minHeight: "auto",
    }),
    option: (styles, {data, isDisabled, isFocused, isSelected}) => {
      const color = data.color ? chroma(data.color) : colorMultiSelect
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
            ? data.color
            : isFocused
              ? color.alpha(0.1).css()
              : null,
        color: isDisabled
          ? "#ccc"
          : isSelected
            ? chroma.contrast(color, "white") > 2
              ? "white"
              : "black"
            : data.color,
        cursor: isDisabled ? "not-allowed" : "default",
  
        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled && (isSelected ? data.color : "white")
        }
      }
    },
    multiValue: (styles, {data}) => {
      const color = data.color ? chroma(data.color) : colorMultiSelect
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css()
      }
    },
    multiValueLabel: (styles, {data}) => ({
      ...styles,
      color: data.color ? data.color : colorMultiSelect
    }),
    multiValueRemove: (styles, {data}) => ({
      ...styles,
      color: data.color,
      ":hover": {
        backgroundColor: data.color ? data.color : colorMultiSelect,
        color: "white"
      }
    }),
    valueContainer: base => ({
      ...base,
      padding: 0,
      'margin-left': '-2px'
    }),
    indicatorSeparator: (styles) => ({display: 'none'})
  };