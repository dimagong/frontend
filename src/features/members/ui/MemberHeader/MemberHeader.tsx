import "./styles.scss";

import React, { FC } from "react";

import { Logo } from "./components/Logo";
// import { UserInfo } from "./components/UserInfo";

export type MemberHeaderProps = {
  logoSrc: string;
  userName: string;
  avatarSrc: string;
  organizationName: string;
  onHomeClick?: () => void;
  onSurveyClick?: () => void;
  onLogoutClick?: () => void;
};

export const MemberHeader: FC<MemberHeaderProps> = ({
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

      {/*<UserInfo
        userName={userName}
        organizationName={organizationName}
        onLogoutClick={onLogoutClick}
        onHomeClick={onHomeClick}
        onSurveyClick={onSurveyClick}
        avatarSrc={avatarSrc}
      />*/}
    </header>
  );
};
