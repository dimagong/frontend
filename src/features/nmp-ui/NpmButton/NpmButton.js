import React from "react";

import PropTypes from "prop-types";

import { Button } from "antd";

const NpmButton = (props) => {
  return (
    <Button {...props} style={{ backgroundColor: "#22776D" }}>
      {props.children}
    </Button>
  );
};

NpmButton.defaultProps = {
  disabled: false,
  size: "middle",
  type: "primary",
  onClick: () => {},
};

NpmButton.propTypes = {
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["middle", "large", "small"]),
  type: PropTypes.oneOf(["primary", "ghost", "dashed", "link", "text", "default"]),
  onClick: PropTypes.func,
};

export default NpmButton;
