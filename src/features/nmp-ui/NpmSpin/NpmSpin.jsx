import React from "react";

import PropTypes from "prop-types";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const antIcon = (size) => (
  <LoadingOutlined
    style={{
      fontSize: size,
    }}
    spin
  />
);

const NpmSpin = (props) => (
  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Spin indicator={antIcon(props.size)} />
  </div>
);

NpmSpin.defaultProps = {
  size: 40,
};

NpmSpin.propTypes = {
  size: PropTypes.number,
};

export default NpmSpin;
