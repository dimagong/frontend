import React from "react";

import { MemberPage } from "./MemberPage";

export default {
  title: "Member/Page",
  component: MemberPage,
};

const Template = (props) => {
  return <MemberPage />;
};

export const Base = Template.bind({});
