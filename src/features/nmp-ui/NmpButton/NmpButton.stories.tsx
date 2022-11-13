import React from "react";
import { RightOutlined, LeftOutlined, DownOutlined } from "@ant-design/icons";

import { NmpButton } from "./NmpButton";

const icons = {
  left: <LeftOutlined />,
  right: <RightOutlined />,
};

const storySettings = {
  title: "Nmp/Button",
  component: NmpButton,
  argTypes: {
    type: {
      name: "type",
      type: { name: "string", required: false },
      defaultValue: "nmp-default",
      control: "select",
      options: ["default", "primary", "ghost", "dashed", "link", "text", "nmp-default", "nmp-ghost", "nmp-primary"],
    },
    icon: {
      name: "icon",
      type: { name: "object", required: false },
      options: Object.keys(icons),
      mapping: icons,
      control: {
        type: "select",
        labels: {
          left: "Left",
          right: "Right",
        },
      },
    },
    shape: {
      name: "shape",
      defaultValue: "default",
      type: { name: "string", required: false },
      control: "select",
      options: ["default", "circle", "round", "nmp-ellipse"],
    },
    size: {
      name: "size",
      type: { name: "string", required: false },
      control: "select",
      options: ["small", "middle", "large"],
    },
    disabled: {
      name: "disabled",
      type: { name: "boolean", required: false },
      defaultValue: false,
    },
    loading: {
      name: "loading",
      type: { name: "boolean", required: false },
      defaultValue: false,
    },
    children: {
      name: "children",
      defaultValue: "Button",
      control: "text",
    },
  },
};

export default storySettings;

const Template = (props: any) => <NmpButton {...props} />;

export const Default = Template.bind({});
Default.args = {
  type: "nmp-default",
};

export const Primary = Template.bind({});
Primary.args = {
  type: "nmp-primary",
};

export const Ghost = Template.bind({});
Ghost.args = {
  type: "nmp-ghost",
};

export const RightIcon = Template.bind({});

RightIcon.args = {
  iconRight: true,
  icon: icons.right,
};

export const Ellipse = Template.bind({});

Ellipse.args = {
  type: "nmp-primary",
  shape: "nmp-ellipse",
  icon: <DownOutlined />,
  children: undefined,
};
