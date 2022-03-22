import React from "react";

import SearchIcon from "@material-ui/icons/Search";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { useToggle } from "hooks/use-toggle";

import NmpPlainInput from "./NmpPlainInput";

export default {
  title: "NmpPlainInput",
  component: NmpPlainInput,
};

const Template = (props) => {
  const [value, setValue] = React.useState("");

  React.useEffect(() => setValue(props.value), [props.value]);

  const onChange = React.useCallback(
    (value) => {
      setValue(value);
      props.onChange && props.onChange(value);
    },
    [props]
  );

  return <NmpPlainInput {...props} value={value} onChange={onChange} />;
};

const defaultArgs = {
  type: "text",
  valid: undefined,
  disabled: undefined,
  readonly: undefined,
  placeholder: "Place plain text here...",
  value: "Han Parker",
};

export const Base = Template.bind();

Base.args = defaultArgs;

export const Prepend = Template.bind();

Prepend.args = {
  ...defaultArgs,
  prepend: <SearchIcon className="m-auto " />,
};

export const Append = Template.bind();

Append.args = {
  ...defaultArgs,
  append: <Visibility className="m-auto " />,
};

export const Password = (props) => {
  const [isPasswordType, toggleType] = useToggle(true);

  return (
    <Template
      {...props}
      type={isPasswordType ? "password" : "text"}
      append={
        <button className="btn p-0" onClick={toggleType}>
          {isPasswordType ? <Visibility className="m-auto " /> : <VisibilityOff className="m-auto " />}
        </button>
      }
    />
  );
};

Password.args = defaultArgs;
