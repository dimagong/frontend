import React from "react";

import PropTypes from "prop-types";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (size) => (
  <LoadingOutlined
    style={{
      fontSize: size,
    }}
    spin
  />
);

const NpmSpin = (props) => (
  <div
    style={{
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      position: "fixed",
    }}
  >
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
