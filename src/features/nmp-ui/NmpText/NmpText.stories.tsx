import React from "react";

import { NmpText, NmpTextProps } from "./NmpText";

const storySettings = {
  title: "Nmp/Text",
  component: NmpText,
  argTypes: {
    text: {
      name: "text",
      type: { name: "string", required: false },
      defaultValue: "",
    },
    className: {
      name: "className",
      type: { name: "string", required: false },
      defaultValue: "",
    },
    style: {
      name: "style",
      type: { name: "object", required: false },
      defaultValue: {},
    },
  },
};

export default storySettings;

const Template = (props: NmpTextProps) => <NmpText {...props} />;

export const Types = Template.bind({});

Types.args = {
  text: "show truncated text",
};

export const TruncateTest = Template.bind({});

TruncateTest.args = {
  text: "show truncated text",
  style: { width: 100 },
};
