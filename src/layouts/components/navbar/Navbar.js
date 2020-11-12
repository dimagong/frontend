import React from "react"
import { Navbar } from "reactstrap"
import { connect } from "react-redux"
import classnames from "classnames"
import { useDispatch } from 'react-redux'
import {
  logoutWithJWT,
} from "app/actions/vuexy/auth/loginActions"

import NavbarUser from "./NavbarUser"
import noneAvatar from "assets/img/portrait/none-avatar.png";
import { bindActionCreators } from "redux"
import { history } from "../../../history";

import {selectManager, selectProfile, selectManagers} from "app/selectors"
import { NavLink } from "react-router-dom"
import { ChevronDown } from "react-feather"

import { logout, showContextSearch } from 'app/slices/appSlice'

import {userService} from 'services/user'

import SearchInput from './SearchInput'

const UserName = ({userProfile}) => {
  if (Object.keys(userProfile).length && userProfile.constructor === Object) {
    return userProfile.first_name;
  }
  return '';
}

const ThemeNavbar = props => {
  const dispatch = useDispatch();
  const {manager, managers, userProfile} = props;
  const colorsArr = ["primary", "danger", "success", "info", "warning", "dark"]
  const navbarTypes = ["floating", "static", "sticky", "hidden"]

  const logoutJWT = async () => {
    props.logout();
    props.logoutWithJWT();
    history.push("/login");
  }

  const handleContextSearchToggle = () => {
    dispatch(showContextSearch())
  }

  return userProfile
  ? (
    <React.Fragment>
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <Navbar
        className={classnames(
          "header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow",
          {
            "navbar-light": props.navbarColor === "default" || !colorsArr.includes(props.navbarColor),
            "navbar-dark": colorsArr.includes(props.navbarColor),
            "bg-primary":
              props.navbarColor === "primary" && props.navbarType !== "static",
            "bg-danger":
              props.navbarColor === "danger" && props.navbarType !== "static",
            "bg-success":
              props.navbarColor === "success" && props.navbarType !== "static",
            "bg-info":
              props.navbarColor === "info" && props.navbarType !== "static",
            "bg-warning":
              props.navbarColor === "warning" && props.navbarType !== "static",
            "bg-dark":
              props.navbarColor === "dark" && props.navbarType !== "static",
            "d-none": props.navbarType === "hidden" && !props.horizontal,
            "floating-nav":
              (props.navbarType === "floating" && !props.horizontal) || (!navbarTypes.includes(props.navbarType) && !props.horizontal),
            "navbar-static-top":
              props.navbarType === "static" && !props.horizontal,
            "fixed-top": props.navbarType === "sticky" || props.horizontal,
            "scrolling": props.horizontal && props.scrolling,
            // "is-onboarding": userService.isOnboarding(props.userProfile)
          }
        )}
      >
        <div className="navbar-wrapper">
          <div className="navbar-container content">
            <div
              className="navbar-collapse d-flex justify-content-between align-items-center"
              id="navbar-mobile"
            >
              <div className="bookmark-wrapper">
                <NavLink to="/" className="navbar-brand logo d-flex align-items-center">
                  <div className="brand-logo" />
                </NavLink>
                  {/* <NavbarBookmarks
                    sidebarVisibility={props.sidebarVisibility}
                    handleAppOverlay={props.handleAppOverlay}
                  /> */}
              </div>

              {!userService.isOnboarding(userProfile) && (
                <div className="search-input_container">
                  <SearchInput suggestions={managers.map(({ first_name, ...rest }) => ({ name: first_name, ...rest }))}/>
                  <ChevronDown
                    className="autocomplete-expand-icon"
                    onClick={handleContextSearchToggle}
                  />
                </div>
              )}



              {/* {props.horizontal ? (
                <div className="logo d-flex align-items-center">
                  <div className="brand-logo mr-50"></div>
                  <h2 className="text-primary brand-text mb-0">Vuexy</h2>
                </div>
              ) : null} */}
              <NavbarUser
                handleAppOverlay={props.handleAppOverlay}
                changeCurrentLang={props.changeCurrentLang}
                userName={<UserName {...props} />}
                email={userProfile.email}
                userImg={manager && manager.ulr? manager.ulr : noneAvatar}
                loggedType={null}
                logoutWithJWT={logoutJWT}
              />
            </div>
          </div>
        </div>
      </Navbar>
    </React.Fragment>
  ) : null
}

const mapStateToProps = state => {
  return {
    userProfile: selectProfile(state),
    manager: selectManager(state),
    managers: selectManagers(state),
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    logoutWithJWT: bindActionCreators(logoutWithJWT, dispatch),
    logout: bindActionCreators(logout, dispatch),
  }
}

export default connect(mapStateToProps, mapActionsToProps)(ThemeNavbar)
