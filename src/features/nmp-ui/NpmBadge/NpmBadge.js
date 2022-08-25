import React from "react";

import PropTypes from "prop-types";

import { ClockCircleOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";

const NpmBadge = (props) => {
  return (
    <>
      <Badge {...props}>
        <Avatar shape="square" size="large" icon={props.icon} />
      </Badge>
    </>
  );
};

NpmBadge.defaultProps = {
  color: "",
  count: 0,
  offset: [0, 0],
  overflowCount: 99,
  showZero: true,
  size: "default",
  status: "default",
  text: "",
  title: "",
  icon: <ClockCircleOutlined />,
};

NpmBadge.propTypes = {
  color: PropTypes.string,
  count: PropTypes.number,
  offset: PropTypes.arrayOf(PropTypes.number),
  overflowCount: PropTypes.number,
  showZero: PropTypes.bool,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(["default", "small"])]),
  status: PropTypes.oneOf(["success", "processing ", "default", "error", "warning"]),
  text: PropTypes.node,
  title: PropTypes.string,
  icon: PropTypes.node,
};

export default NpmBadge;
