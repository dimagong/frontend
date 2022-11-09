import "./styles.scss";

import React, { FC } from "react";

import { UserInfo } from "./components/UserInfo";
import { Logo } from "./components/Logo/Logo";

export const MemberHeader: FC<Props> = ({ userName, organizationName, onLogout, logoSrc, avatarSrc, children }) => {
  return (
    <header className="member-header">
      <div className="member-header__logo-wrapper">
        <Logo src={logoSrc} organizationName={organizationName} />
      </div>

      {children}

      <UserInfo userName={userName} organizationName={organizationName} onLogout={onLogout} avatarSrc={avatarSrc} />
    </header>
  );
};

export type Props = {
  userName: string;
  organizationName: string;
  onLogout: () => void;
  logoSrc: string;
  avatarSrc: string;
};
