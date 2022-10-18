import React, { CSSProperties } from "react";

import { NmpText, NmpTextType } from "./NmpText";

const storySettings = {
  title: "NmpText",
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
      type: { name: "CSSProperties", required: false },
      defaultValue: {},
    },
  },
};

export default storySettings;

const Template = (props: NmpTextType) => <NmpText {...props} />;

export const Types = Template.bind({});
