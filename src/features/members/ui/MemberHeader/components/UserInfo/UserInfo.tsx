import "./styles.scss";

import React, { FC } from "react";
import { Avatar, Dropdown } from "antd";

import { DownOutlined, PoweroffOutlined } from "@ant-design/icons";
import { NmpText } from "features/nmp-ui";

export const UserInfo: FC<Props> = ({ userName, organizationName, onLogout, avatarSrc }) => {
  const items = [
    {
      label: (
        <div onClick={() => onLogout()}>
          <PoweroffOutlined className="mr-50" />
          <span className="align-middle">Log Out</span>
        </div>
      ),
      key: "item-1",
    },
  ];

  return (
    <Dropdown menu={{ items }} className="hello">
      <div className="user-info__drop-down ant-dropdown-open">
        <div className="user-info__content">
          <div>
            <NmpText className="user-info__name" text={userName} style={{ maxWidth: 130 }} />
            <NmpText className="user-info__organization" text={organizationName} style={{ maxWidth: 130 }} />
          </div>
          <Avatar size={30} src={avatarSrc} />
        </div>
        <DownOutlined className="user-info__arrow" />
      </div>
    </Dropdown>
  );
};

export type Props = {
  userName: string;
  organizationName: string;
  onLogout: () => void;
  avatarSrc: string;
};
