import React from "react";
import * as Icon from "react-feather";
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";

import DeprecatedNmpUserAvatar from "components/nmp/DeprecatedNmpUserAvatar";

const UserDropdown = ({ logoutWithJWT }) => {
  return (
    <DropdownMenu right>
      <DropdownItem tag="a" onClick={() => logoutWithJWT()}>
        <Icon.Power size={14} className="mr-50" />
        <span className="align-middle">Log Out</span>
      </DropdownItem>
    </DropdownMenu>
  );
};

const NavbarUser = ({ userId, userAvatarId, userName, email, logoutWithJWT }) => (
  <ul className="nav navbar-nav navbar-nav-user float-right">
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle tag="a" className="nav-link dropdown-user-link">
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name">{userName}</span>
          <span className="user-status">{email}</span>
        </div>
        <span data-tour="user">
          <DeprecatedNmpUserAvatar
            userId={userId}
            fileId={userAvatarId}
            isOnboarding={false}
            className="round"
            style={{ width: 40, height: 40 }}
          />
        </span>
      </DropdownToggle>
      <UserDropdown logoutWithJWT={logoutWithJWT} />
    </UncontrolledDropdown>
  </ul>
);

export default NavbarUser;
