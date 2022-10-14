import "./styles.scss";

import React from "react";

import PropTypes from "prop-types";

import { Card } from "antd";

const NpmCard = (props) => (
  <div className="site-card-border-less-wrapper">
    <Card title={props.title} bordered={true} actions={props.actions} style={props.style}>
      {props.children}
    </Card>
  </div>
);

NpmCard.defaultProps = {
  size: "default",
};

NpmCard.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.element,
  actions: PropTypes.element,
  children: PropTypes.element,
  size: PropTypes.oneOf(["default", "small"]),
};

export default NpmCard;
