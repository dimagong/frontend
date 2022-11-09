import React from "react";
import { MemberHeader } from "./MemberHeader";

import "assets/styles/index.scss";

const storySettings = {
  title: "MemberView/Header",
  component: MemberHeader,
  argTypes: {
    organizationName: {
      name: "organizationName",
      type: { name: "string", required: true },
      defaultValue: "testOrganization",
    },
    userName: {
      name: "userName",
      type: { name: "string", required: true },
      defaultValue: "defaultName",
    },
    avatarSrc: {
      name: "avatarSrc",
      type: { name: "string", required: false },
      defaultValue: "https://picsum.photos/200/300",
    },
    logoSrc: {
      name: "logoSrc",
      type: { name: "string", required: false },
      defaultValue: "https://picsum.photos/200/300",
    },
    onLogout: { action: "Logout" },
    children: {
      name: "children",
      defaultValue: "children",
      control: "text",
    },
  },
};

export default storySettings;

const Template = (props: any) => <MemberHeader {...props} />;

export const Base = Template.bind({});

export const LongUserInfo = Template.bind({});

export const NoImages = Template.bind({});

LongUserInfo.args = {
  userName: "LongLongLongLongLongName",
  organizationName: "LongLongLongLongLongOrganization",
};

NoImages.args = {
  logoSrc: "",
  avatarSrc: "",
};
