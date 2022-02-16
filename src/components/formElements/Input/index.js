import React from "react";
import PropTypes from "prop-types";
import { Input as RSInput } from "reactstrap";

const Input = ({ type, value, onChange, ...attrs }) => {
  return <RSInput type={type} value={value} onChange={onChange} {...attrs} />;
};

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Input;
