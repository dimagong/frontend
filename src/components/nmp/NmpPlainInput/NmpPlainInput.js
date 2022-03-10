import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import { Input } from "reactstrap";
import classNames from "classnames";

import { useForkRef } from "hooks/useForkRef";

const NmpPlainInput = React.forwardRef((props, ref) => {
  const {
    type,
    valid,
    disabled,
    readonly,
    placeholder,
    value,
    onChange: propOnChange,
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

  const onSlotClick = React.useCallback((event) => {
    safeFocus();
    event.preventDefault();
    event.stopPropagation();
  }, [safeFocus]);

  const onSlotMouseUp = React.useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <div
      {...wrapperAttrs}
      className={classNames(
        "nmp-input d-flex",
        {
          "nmp-input--appended": Boolean(append),
          "nmp-input--prepended": Boolean(prepend),
          "nmp-input--valid": valid === true,
          "nmp-input--invalid": valid === false,
        },
        wrapperAttrs?.className
      )}
    >
      {prepend ? (
        <div className="d-flex" onClick={onSlotClick} onMouseUp={onSlotMouseUp}>
          {prepend}
        </div>
      ) : null}
      <Input
        type={type}
        valid={valid == null ? void 0 : valid === true}
        invalid={valid == null ? void 0 : valid === false}
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
        <div className="d-flex" onClick={onSlotClick} onMouseUp={onSlotMouseUp}>
          {append}
        </div>
      ) : null}
    </div>
  );
});

const TYPES = ["email", "number", "password", "search", "tel", "text", "url"];

NmpPlainInput.propTypes = {
  type: PropTypes.oneOf(TYPES),
  valid: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  placeholder: PropTypes.string,

  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,

  prepend: PropTypes.node,
  append: PropTypes.node,

  wrapperAttrs: PropTypes.object,
};

export default NmpPlainInput;
