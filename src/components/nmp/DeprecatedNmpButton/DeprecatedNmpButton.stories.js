import React from "react";
import { User } from "react-feather";

import DeprecatedNmpButton from "./NmpButton";

export default {
  title: "NmpButton",
  component: DeprecatedNmpButton,
  argTypes: {
    size: {
      options: ["", "sm", "lg"],
      control: "select",
    },
    textColor: { control: "text" },
    backgroundColor: { control: "text" },
    spinnerColor: { control: "text" },
  },
};

const ARGS = {
  children: "Click me",
  color: "primary",

  size: "",
  outline: false,
  block: false,
  active: false,
};

const Template = (props) => <DeprecatedNmpButton {...props} />;

export const Base = Template.bind();

Base.args = ARGS;

export const CustomColor = Template.bind();

CustomColor.args = {
  ...ARGS,
  textColor: "#fac",
  backgroundColor: "#333",
};

export const Icon = (props) => {
  return <DeprecatedNmpButton {...props} icon={<User />} />;
};

Icon.args = {
  ...ARGS,
};
