import "./styles.scss";

import React, { FC } from "react";
import { Avatar, Dropdown } from "antd";

import { NmpText } from "features/nmp-ui";
import ArrowDownIcon from "assets/img/icons/arrow-down-black.png";
import LogoutIcon from "assets/img/icons/logout.png";
import HomeIcon from "assets/img/icons/home.png";
import SurveyIcon from "assets/img/icons/survey.png";
import DefaultUser from "assets/img/icons/default-user.png";

export type UserInfoProps = {
  userName: string;
  avatarSrc: string;
  organizationName: string;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  onSurveyClick?: () => void;
};

export const UserInfo: FC<UserInfoProps> = ({
  userName,
  organizationName,
  onLogoutClick,
  onHomeClick,
  onSurveyClick,
  avatarSrc,
}) => {
  const items = [
    {
      label: (
        <div onClick={onHomeClick}>
          <img className="user-info__drop-down-icon" src={HomeIcon} alt="HomeIcon" />
          <span className="align-middle">Home</span>
        </div>
      ),
      key: "item-1",
    },
    {
      label: (
        <div onClick={onSurveyClick}>
          <img className="user-info__drop-down-icon" src={SurveyIcon} alt="SurveyIcon" />
          <span className="align-middle">Survey</span>
        </div>
      ),
      key: "item-2",
    },
    {
      label: (
        <div onClick={onLogoutClick}>
          <img className="user-info__drop-down-icon" src={LogoutIcon} alt="LogoutIcon" />
          <span className="align-middle">Logout</span>
        </div>
      ),
      key: "item-3",
    },
  ];

  return (
    <div className="user-info">
      <Dropdown menu={{ items }} className="hello" placement="topRight" overlayClassName="user-info__overlay">
        <div className="user-info__drop-down ant-dropdown-open">
          <div className="user-info__content">
            <div>
              <NmpText className="user-info__name" text={userName} style={{ maxWidth: 130 }} />
              <NmpText className="user-info__organization" text={organizationName} style={{ maxWidth: 130 }} />
            </div>
            <Avatar size={30} src={avatarSrc || DefaultUser} />
          </div>
          <img className="user-info__arrow-icon" src={ArrowDownIcon} alt="ArrowDownIcon" />
        </div>
      </Dropdown>
    </div>
  );
};
