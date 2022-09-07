import "./styles.scss";

import React from "react";

import PropTypes from "prop-types";

import { Input } from "antd";

const { TextArea } = Input;

const NpmTextArea = (props) => (
  <>
    <TextArea {...props} onChange={(e) => props.onChange(e.target.value)} />
  </>
);

export default NpmTextArea;

NpmTextArea.defaultProps = {
  size: "middle",
  rows: 6,
  maxLength: 200,
};

NpmTextArea.propTypes = {
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.oneOf(["middle", "small", "large"]),
  addonAfter: PropTypes.node,
  addonBefore: PropTypes.node,
  rows: PropTypes.number,
};
