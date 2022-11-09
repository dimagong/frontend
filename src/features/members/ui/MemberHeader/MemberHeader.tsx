import "./styles.scss";

import React, { FC } from "react";

import { UserInfo } from "./components/UserInfo";
import { Logo } from "./components/Logo/Logo";

export const MemberHeader: FC<Props> = ({
  userName,
  organizationName,
  onLogoutClick,
  onHomeClick,
  onSurveyClick,
  logoSrc,
  avatarSrc,
  children,
}) => {
  return (
    <header className="member-header">
      <div className="member-header__logo-wrapper">
        <Logo src={logoSrc} organizationName={organizationName} />
      </div>

      {children}

      <UserInfo
        userName={userName}
        organizationName={organizationName}
        onLogoutClick={onLogoutClick}
        onHomeClick={onHomeClick}
        onSurveyClick={onSurveyClick}
        avatarSrc={avatarSrc}
      />
    </header>
  );
};

export type Props = {
  userName: string;
  organizationName: string;
  onLogoutClick: () => void;
  onHomeClick: () => void;
  onSurveyClick: () => void;
  logoSrc: string;
  avatarSrc: string;
};
