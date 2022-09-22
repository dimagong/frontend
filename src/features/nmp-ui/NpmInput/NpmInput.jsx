import "./styles.scss";

import React from "react";

import PropTypes from "prop-types";

import { Input } from "antd";

const NpmInput = (props) => {
  return <Input {...props} onChange={(e) => props.onChange(e.target.value)} />;
};

NpmInput.defaultProps = {
  size: "middle",
};

NpmInput.propTypes = {
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.oneOf(["middle", "small", "large"]),
  addonAfter: PropTypes.node,
  addonBefore: PropTypes.node,
};

export default NpmInput;
