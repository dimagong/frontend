import React from "react"
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap"
import * as Icon from "react-feather"

const UserDropdown = props => {
  return (
    <DropdownMenu right>
      {/* <DropdownItem
        tag="a"
        href="#"
        onClick={e => handleNavigation(e, "/pages/profile")}
      >
        <Icon.User size={14} className="mr-50" />
        <span className="align-middle">Edit Profile</span>
      </DropdownItem> */}
      {/* <DropdownItem
        tag="a"
        href="#"
        onClick={e => handleNavigation(e, "/email/inbox")}
      >
        <Icon.Mail size={14} className="mr-50" />
        <span className="align-middle">My Inbox</span>
      </DropdownItem> */}
      {/* <DropdownItem divider /> */}
      <DropdownItem
        tag="a"
        onClick={e => {
          props.logoutWithJWT();
        }}
      >
        <Icon.Power size={14} className="mr-50" />
        <span className="align-middle">Log Out</span>
      </DropdownItem>
    </DropdownMenu>
  )
}

const NavbarUser = ({userImg, userName, email, ...props}) => (

      <ul className="nav navbar-nav navbar-nav-user float-right">
        <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
          <DropdownToggle tag="a" className="nav-link dropdown-user-link">
            <div className="user-nav d-sm-flex d-none">
              <span className="user-name">
                {userName}
              </span>
              <span className="user-status">{email}</span>
            </div>
            <span data-tour="user">
              <img
                src={userImg}
                className="round"
                height="40"
                width="40"
                alt="avatar"
              />
            </span>
          </DropdownToggle>
          <UserDropdown {...props} />
        </UncontrolledDropdown>
      </ul>
    )

export default NavbarUser
