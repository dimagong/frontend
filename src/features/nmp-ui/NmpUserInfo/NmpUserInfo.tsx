import "./styles.scss";

import React from "react";
import type { FC } from "react";
import { Avatar, Dropdown } from "antd";

import { NmpText } from "../NmpText";
import { NmpArrowUpIcon, NmpAvatarIcon, NmpLogoutIcon } from "../icons";

export type NmpUserInfoProps = {
  username?: string;
  avatarSrc?: string;
  organizationName: string;

  onLogout?: () => void;
};

export const NmpUserInfo: FC<NmpUserInfoProps> = (props) => {
  const { username, avatarSrc, organizationName, onLogout } = props;

  const items = [
    {
      label: (
        <div className="nmp-user-info__dropdown-item" onClick={onLogout}>
          <NmpLogoutIcon />
          <span className="nmp-user-info__dropdown-item-label">Logout</span>
        </div>
      ),
      key: "item-3",
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="topRight" overlayClassName="nmp-user-info__overlay">
      <div className="nmp-user-info">
        <div className="nmp-user-info__content">
          <div className="nmp-user-info__meta">
            <NmpText className="nmp-user-info__username" text={username} />
            <NmpText className="nmp-user-info__organization-name" text={organizationName} />
          </div>

          {avatarSrc ? (
            <Avatar className="nmp-user-info__avatar-icon" src={avatarSrc} />
          ) : (
            <NmpAvatarIcon className="nmp-user-info__avatar-icon" />
          )}

          <div className="nmp-user-info__dropdown-arrow-icon">
            <NmpArrowUpIcon />
          </div>
        </div>
      </div>
    </Dropdown>
  );
};
