import React from "react";
import { Avatar } from "antd";

import { NmpBadge } from "./NmpBadge";

export default {
  title: "Nmp/Badge",
  component: NmpBadge,
};

const Template = (props) => <NmpBadge {...props} />;

export const Base = Template.bind({});
Base.args = {
  dot: true,
  status: "default",
  children: <Avatar shape="square" size="large" />,
};

export const ShowNumber = Template.bind({});

ShowNumber.args = {
  dot: true,
  count: 0,
  overflowCount: 99,
  showZero: true,
  children: <Avatar shape="square" size="large" />,
};
