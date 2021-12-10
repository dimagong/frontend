import { isNil } from "lodash/fp";
import PropTypes from "prop-types";
import { Button, Spinner } from "reactstrap";
import React, { useLayoutEffect, useMemo, useRef } from "react";

import { stringIsColor } from "utility/string-is-color";

const MSEButton = ({ loading, textColor, backgroundColor, spinner, children, ...attrs }) => {
  const buttonRef = useRef();
  const textColorIsColor = useMemo(() => stringIsColor(textColor), [textColor]);
  const backgroundColorIsColor = useMemo(() => stringIsColor(backgroundColor), [backgroundColor]);

  useLayoutEffect(() => {
    if (!buttonRef.current) return;

    if (textColorIsColor) {
      buttonRef.current.style.setProperty("color", textColor, "important");
    }

    if (backgroundColorIsColor) {
      buttonRef.current.style.setProperty("background-color", backgroundColor, "important");
    }
  }, [backgroundColor, backgroundColorIsColor, textColor, textColorIsColor]);

  return (
    <Button innerRef={buttonRef} {...attrs}>
      {loading ? (
        <div className="position-relative">
          <div className="invisible">{children}</div>
          <div className="position-absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            { spinner || <Spinner color={attrs.color} size="sm" /> }
          </div>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

const hashColorStringPropValidator = (props, propName, componentName) => {
  const value = props[propName];
  const valid = [isNil, stringIsColor].some((v) => v(value));

  if (!valid) {
    return new Error(`Invalid prop \`${propName}\` supplied \`${componentName}\`. Prop should be a color string.`);
  }
};

MSEButton.defaultProps = {
  loading: false,
};

MSEButton.propTypes = {
  loading: PropTypes.bool,
  textColor: hashColorStringPropValidator,
  backgroundColor: hashColorStringPropValidator,
  spinner: PropTypes.node,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default MSEButton;
