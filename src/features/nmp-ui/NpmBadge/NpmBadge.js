import React from "react";

import PropTypes from "prop-types";

import { FileTextOutlined } from "@ant-design/icons";
import { Badge } from "antd";

const NpmBadge = (props) => {
  return (
    <>
      <Badge {...props}>{props.icon}</Badge>
    </>
  );
};

NpmBadge.defaultProps = {
  color: "#22776D",
  count: 0,
  offset: [-5, 0],
  overflowCount: 99,
  showZero: true,
  size: "large",
  status: "default",
  text: "",
  title: "",
  icon: <FileTextOutlined style={{ fontSize: 42, color: "#BCBCBC" }} />,
};

NpmBadge.propTypes = {
  color: PropTypes.string,
  count: PropTypes.number,
  offset: PropTypes.arrayOf(PropTypes.number),
  overflowCount: PropTypes.number,
  showZero: PropTypes.bool,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(["default", "small", "large"])]),
  status: PropTypes.oneOf(["success", "processing ", "default", "error", "warning"]),
  text: PropTypes.node,
  title: PropTypes.string,
  icon: PropTypes.node,
};

export default NpmBadge;
