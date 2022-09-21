import React from "react";

import { Tooltip } from "antd";
import PropTypes from "prop-types";

const NpmTooltip = (props) => {
  const text = <span>{props.text}</span>;
  return (
    <>
      <Tooltip {...props} title={text}>
        {props.children}
      </Tooltip>
    </>
  );
};

NpmTooltip.defaultProps = {
  placement: "right",
  text: "some hint",
  color: "",
  trigger: "hover",
};

NpmTooltip.propTypes = {
  placement: PropTypes.oneOf([
    "right",
    "top",
    "left",
    "bottom ",
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
    "leftTop",
    "leftBottom",
    "rightTop",
    "rightBottom",
  ]),
  trigger: PropTypes.oneOf(["hover", "focus", "click", "contextMenu", PropTypes.array]),
  text: PropTypes.string,
  color: PropTypes.string,
};

export default NpmTooltip;
