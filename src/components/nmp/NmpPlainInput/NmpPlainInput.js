import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import { Input } from "reactstrap";
import classNames from "classnames";

import { useForkRef } from "hooks/useForkRef";
import { stopAndPrevent } from "utility/event-decorators";

const NmpPlainInput = React.forwardRef((props, ref) => {
  const {
    type,
    value,
    onChange: propOnChange,

    valid = false,
    invalid = false,
    disabled = false,
    readonly = false,

    placeholder,

    prepend,
    append,

    className,
    wrapperAttrs,
    ...attrs
  } = props;

  const inputRef = React.useRef(null);
  const forkedRef = useForkRef(ref, inputRef);

  const onChange = React.useCallback((event) => propOnChange(event.target.value), [propOnChange]);

  const safeInput = React.useCallback((inputProvider) => {
    if (!forkedRef.current) return;
    inputProvider(forkedRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safeFocus = React.useCallback(() => safeInput((input) => input.focus()), [safeInput]);

  const onSlotClick = React.useCallback(
    (event) => {
      safeFocus();
      event.preventDefault();
      event.stopPropagation();
    },
    [safeFocus]
  );

  return (
    <div
      {...wrapperAttrs}
      className={classNames(
        "nmp-input d-flex",
        {
          "nmp-input--appended": Boolean(append),
          "nmp-input--prepended": Boolean(prepend),
          "nmp-input--valid": valid,
          "nmp-input--invalid": invalid,
        },
        wrapperAttrs?.className
      )}
    >
      {prepend ? (
        <div className="d-flex" onClick={onSlotClick} onMouseDown={stopAndPrevent}>
          {prepend}
        </div>
      ) : null}

      <Input
        type={type}
        valid={valid}
        invalid={invalid}
        disabled={disabled}
        readonly={readonly}
        plaintext={readonly}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        innerRef={forkedRef}
        className={classNames("nmp-input__input", className)}
        {...attrs}
      />

      {append ? (
        <div className="d-flex" onClick={onSlotClick} onMouseDown={stopAndPrevent}>
          {append}
        </div>
      ) : null}
    </div>
  );
});

const TYPES = ["email", "number", "password", "search", "tel", "text", "url"];

NmpPlainInput.propTypes = {
  type: PropTypes.oneOf(TYPES),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,

  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,

  placeholder: PropTypes.string,

  prepend: PropTypes.node,
  append: PropTypes.node,

  wrapperAttrs: PropTypes.object,
};

export default NmpPlainInput;
