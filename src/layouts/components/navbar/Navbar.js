import React, { useEffect } from "react";
import { Navbar, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from "reactstrap";
import { connect, useSelector } from "react-redux";
import classnames from "classnames";
import { useDispatch } from "react-redux";
import { logoutWithJWT } from "app/actions/vuexy/auth/loginActions";

import NavbarUser from "./NavbarUser";
import { bindActionCreators } from "redux";
import { history } from "../../../history";

import { selectManager, selectProfile, selectManagers } from "app/selectors";
import { NavLink } from "react-router-dom";
import store from "app/store";
import { ChevronDown, ChevronUp, Power, Menu } from "react-feather";
import { userService } from "services/user";

import SearchInput from "./SearchInput";

import appSlice from "app/slices/appSlice";
import { getMemberFirms } from "app/selectors/memberFirmsSelector";
import NmpOrganizationLogo from "../../../components/nmp/NmpOrganizationLogo";

const { logout, showContextSearch, hideContextSearch, setContext, getUserAvatarRequest } = appSlice.actions;

const UserName = ({ userProfile }) => {
  if (Object.keys(userProfile).length && userProfile.constructor === Object) {
    return userProfile.first_name;
  }
  return "";
};

const ThemeNavbar = (props) => {
  const dispatch = useDispatch();
  const { managers, userProfile } = props;
  const colorsArr = ["primary", "danger", "success", "info", "warning", "dark"];
  const navbarTypes = ["floating", "static", "sticky", "hidden"];
  const memberFirms = useSelector(getMemberFirms);

  const logoutJWT = async () => {
    store.dispatch(logout());
    // props.logout();
    // props.logoutWithJWT();
    history.push("/login");
  };

  const handleContextSearchToggle = () => {
    if (props.isContextSearchVisible) {
      if (props.context) {
        dispatch(hideContextSearch());
      }
    } else {
      dispatch(showContextSearch());
    }
  };

  useEffect(() => {
    userProfile && dispatch(getUserAvatarRequest({ managerId: userProfile.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.avatar_path]);

  const handleOrgPictureClick = () => {
    dispatch(setContext("Dashboard"));
  };

  return userProfile ? (
    <React.Fragment>
      <div className="content-overlay" />
      {/*<div className="header-navbar-shadow" />*/}
      <Navbar
        style={{ width: "100%", margin: 0, borderRadius: 0 }}
        className={classnames("header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow", {
          "navbar-light": props.navbarColor === "default" || !colorsArr.includes(props.navbarColor),
          "navbar-dark": colorsArr.includes(props.navbarColor),
          "bg-primary": props.navbarColor === "primary" && props.navbarType !== "static",
          "bg-danger": props.navbarColor === "danger" && props.navbarType !== "static",
          "bg-success": props.navbarColor === "success" && props.navbarType !== "static",
          "bg-info": props.navbarColor === "info" && props.navbarType !== "static",
          "bg-warning": props.navbarColor === "warning" && props.navbarType !== "static",
          "bg-dark": props.navbarColor === "dark" && props.navbarType !== "static",
          "d-none": props.navbarType === "hidden" && !props.horizontal,
          "floating-nav":
            (props.navbarType === "floating" && !props.horizontal) ||
            (!navbarTypes.includes(props.navbarType) && !props.horizontal),
          "navbar-static-top": props.navbarType === "static" && !props.horizontal,
          "fixed-top": props.navbarType === "sticky" || props.horizontal,
          scrolling: props.horizontal && props.scrolling,
          "simplified-navbar": userProfile.notify && userProfile?.permissions?.ability === "prospect",
        })}
      >
        <div className="navbar-wrapper">
          <div className="navbar-container content">
            <div className="navbar-collapse d-flex justify-content-between align-items-center" id="navbar-mobile">
              <div className="bookmark-wrapper">
                <NavLink to="/" className="navbar-brand logo d-flex align-items-center">
                  <NmpOrganizationLogo
                    fileId={userProfile.permissions.logo?.id}
                    organizationId={userProfile.permissions.organization_id}
                    organizationType={userProfile.permissions.organization_type}
                    organizationName={userProfile.permissions.organization}
                    onClick={handleOrgPictureClick}
                    className="brand-logo"
                  />
                </NavLink>
              </div>

              {!userService.isOnboarding(userProfile) && (
                <div className="search-input_container">
                  <SearchInput
                    suggestions={managers
                      .map(({ first_name, last_name, ...rest }) => ({
                        name: first_name + " " + last_name,
                        ...rest,
                      }))
                      .concat(
                        memberFirms.map((item) => ({ ...item, name: item.main_fields.name, isMemberFirm: true }))
                      )}
                  />
                  {props.isContextSearchVisible ? (
                    <ChevronUp className="autocomplete-expand-icon" onClick={handleContextSearchToggle} />
                  ) : (
                    <ChevronDown className="autocomplete-expand-icon" onClick={handleContextSearchToggle} />
                  )}
                </div>
              )}

              {userProfile.notify && userProfile?.permissions?.ability === "prospect" ? (
                <ul className="nav navbar-nav navbar-nav-user float-right">
                  <UncontrolledDropdown tag="li" className="dropdown-user nav-item burger-menu">
                    <DropdownToggle tag="a" className="nav-link dropdown-user-link">
                      <Menu size={30} />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem tag="a" onClick={logoutJWT}>
                        <Power size={14} className="mr-50" />
                        <span className="align-middle">Log Out</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </ul>
              ) : (
                <NavbarUser
                  handleAppOverlay={props.handleAppOverlay}
                  changeCurrentLang={props.changeCurrentLang}
                  userName={<UserName {...props} />}
                  email={`${userProfile.permissions.organization}`}
                  userId={userProfile.id}
                  userAvatarId={userProfile.avatar?.id}
                  loggedType={null}
                  logoutWithJWT={logoutJWT}
                />
              )}
            </div>
          </div>
        </div>
      </Navbar>
    </React.Fragment>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    userProfile: selectProfile(state),
    manager: selectManager(state),
    managers: selectManagers(state),
    isContextSearchVisible: state.app.isContextSearchVisible,
    context: state.app.context,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    logoutWithJWT: bindActionCreators(logoutWithJWT, dispatch),
    logout: bindActionCreators(logout, dispatch),
  };
};

export default connect(mapStateToProps, mapActionsToProps)(ThemeNavbar);
