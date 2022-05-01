import React from "react";
import { Button, Spinner } from "reactstrap";
import classNames from "classnames";

import "./styles.scss";

const LoadingButton = ({ onClick, isLoading, value, className, color, disabled, ...rest }) => {
  return (
    <Button
      disabled={isLoading || disabled}
      onClick={onClick}
      className={classNames("loading-button", className)}
      color={color}
      {...rest}
    >
      <Spinner
        className={classNames("loading-button_spinner", {
          invisible: !isLoading,
        })}
        size="sm"
      />

      <span
        className={classNames("loading-button_value", {
          invisible: isLoading,
        })}
      >
        {value}
      </span>
    </Button>
  );
};

export default LoadingButton;
