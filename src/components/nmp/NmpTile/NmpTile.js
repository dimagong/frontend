import "./styles.scss";

import _ from "lodash/fp";
import React from "react";
import { X } from "react-feather";
import PropTypes from "prop-types";
import { Badge } from "reactstrap";
import classnames from "classnames";

import NmpButton from "../NmpButton";

const closeSizes = {
  default: 15,
  sm: "12",
  lg: "20",
};

const NmpTile = React.forwardRef((props, ref) => {
  const { href, size, close, onClose = _.noop, color, pill, tag, children, className, cssModule, ...attrs } = props;

  return (
    <Badge
      className={classnames("nmp-tile", className, {
        [`nmp-tile--${size}`]: size,
        "d-inline-flex align-items-center": close,
      })}
      href={href}
      color={color}
      pill={pill}
      tag={tag}
      cssModule={cssModule}
      {...attrs}
    >
      {children}

      {close ? (
        <NmpButton
          className="nmp-tile__close"
          color={color}
          onClick={onClose}
          icon={<X size={closeSizes[size] || closeSizes.default} />}
        />
      ) : null}
    </Badge>
  );
});

NmpTile.propTypes = {
  ..._.omit(["innerRef"], Badge.propTypes),
  href: PropTypes.string,
  size: PropTypes.oneOf(["sm", "lg"]),
  close: PropTypes.bool,
  onClose: PropTypes.func,
};

export default NmpTile;
