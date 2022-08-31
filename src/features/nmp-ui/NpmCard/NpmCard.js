import "./styles.scss";

import React from "react";

import PropTypes from "prop-types";

import { Card } from "antd";

const NpmCard = (props) => (
  <div className="site-card-border-less-wrapper">
    <Card
      title={props.title}
      bordered={true}
      style={{
        width: props.width,
        height: props.height,
      }}
    >
      {props.children}
    </Card>
  </div>
);

NpmCard.defaultProps = {
  title: "No title",
  size: "default",
  width: "783px",
  height: "646px",
};

NpmCard.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.element,
  size: PropTypes.oneOf(["default", "small"]),
};

export default NpmCard;
