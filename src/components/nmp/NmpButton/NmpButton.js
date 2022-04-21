import "./styles.scss";

import _ from "lodash/fp";
import PropTypes from "prop-types";
import classnames from "classnames";
// ToDo replace it by own
import { useForkRef } from "@material-ui/core";
import { Button as RSButton, Spinner as RSSpinner } from "reactstrap";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { stringIsColor } from "utility/string-is-color";

const NmpButton = React.forwardRef((props, ref) => {
  const {
    // RSButton props
    active,
    "aria-label": ariaLabel,
    block,
    color,
    disabled,
    outline,
    tag,
    onClick,
    size,
    cssModule,
    // own props
    icon,
    loading,
    textColor,
    backgroundColor,
    spinner,
    spinnerColor,
    children,
    className,
    ...attrs
  } = props;

  const buttonRef = useRef();
  const forkedRef = useForkRef(buttonRef, ref);
  const [isFirstRender, setFirstRender] = useState(true);
  const textColorIsColor = useMemo(() => stringIsColor(textColor), [textColor]);
  const backgroundColorIsColor = useMemo(() => stringIsColor(backgroundColor), [backgroundColor]);

  useEffect(() => void setTimeout(() => setFirstRender(false)), []);

  useLayoutEffect(() => {
    if (!buttonRef.current) return;

    if (textColorIsColor) {
      buttonRef.current.style.setProperty("color", textColor, "important");
    }

    if (backgroundColorIsColor) {
      buttonRef.current.style.setProperty("background-color", backgroundColor, "important");
    }
  }, [backgroundColor, backgroundColorIsColor, textColor, textColorIsColor]);

  const renderChildren = () => {
    if (icon) return icon;

    return children;
  };

  return (
    <RSButton
      className={classnames(className, {
        // Solve it in another way because this will break all case when transition style needs in initial rendering
        "nmp-btn--initial": isFirstRender,
        "d-inline-flex nmp-btn--icon": Boolean(icon),
      })}
      innerRef={forkedRef}
      active={active}
      aria-label={ariaLabel}
      block={block}
      color={color}
      disabled={disabled}
      outline={outline}
      tag={tag}
      onClick={onClick}
      size={size}
      cssModule={cssModule}
      {...attrs}
    >
      {loading ? (
        <div className="position-relative">
          <div className="invisible">{renderChildren()}</div>
          <div className="position-absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            {spinner || <RSSpinner color={spinnerColor} size="sm" />}
          </div>
        </div>
      ) : (
        renderChildren()
      )}
    </RSButton>
  );
});

const hashColorStringPropValidator = (props, propName, componentName) => {
  const value = props[propName];
  const valid = [_.isNil, stringIsColor].some((v) => v(value));

  if (!valid) {
    return new Error(`Invalid prop \`${propName}\` supplied \`${componentName}\`. Prop should be a color string.`);
  }
};

NmpButton.displayName = "NMPButton";

NmpButton.defaultProps = {
  icon: false,
  loading: false,
};

NmpButton.propTypes = {
  ..._.omit(["innerRef", "close"], RSButton.propTypes),

  icon: PropTypes.node,

  loading: PropTypes.bool,

  textColor: hashColorStringPropValidator,
  backgroundColor: hashColorStringPropValidator,

  spinner: PropTypes.node,
  spinnerColor: hashColorStringPropValidator,
};

export default NmpButton;
