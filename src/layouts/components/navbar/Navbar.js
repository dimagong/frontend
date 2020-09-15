import React from "react"
import { Navbar } from "reactstrap"
import { connect } from "react-redux"
import classnames from "classnames"
// import {
//   logoutWithJWT,
// } from "../../../redux/actions/auth/loginActions"
import NavbarBookmarks from "./NavbarBookmarks"
import NavbarUser from "./NavbarUser"
import userImg from "../../../assets/img/portrait/small/avatar-s-11.jpg"
import { bindActionCreators } from "redux"
// import AuthService from '../../../services/auth.service'
import { history } from "../../../history";
// import userService from "../../../services/user.service";

const UserName = props => {
  if (Object.keys(props.user.profile).length && props.user.profile.constructor === Object) {
    return props.user.profile.name;
  }
  return '';
}

const ThemeNavbar = props => {

  const colorsArr = ["primary", "danger", "success", "info", "warning", "dark"]
  const navbarTypes = ["floating", "static", "sticky", "hidden"]

  const logoutJWT = async () => {
    // await AuthService.logout();
    // AuthService.removeToken();
    history.push("/login");
    // props.logoutWithJWT();
  }
  return (
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
                <NavbarBookmarks
                  sidebarVisibility={props.sidebarVisibility}
                  handleAppOverlay={props.handleAppOverlay}
                />
              </div>
              {props.horizontal ? (
                <div className="logo d-flex align-items-center">
                  <div className="brand-logo mr-50"></div>
                  <h2 className="text-primary brand-text mb-0">Vuexy</h2>
                </div>
              ) : null}
              <NavbarUser
                handleAppOverlay={props.handleAppOverlay}
                changeCurrentLang={props.changeCurrentLang}
                userName={<UserName {...props} />}
                email={props.user.profile.email}
                userImg={userImg}
                loggedType={null}
                // logoutWithJWT={logoutJWT}
              />
            </div>
          </div>
        </div>
      </Navbar>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user,
    userProfile: state.user.profile
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    // logoutWithJWT: bindActionCreators(logoutWithJWT, dispatch)
  }
}

export default connect(mapStateToProps, mapActionsToProps)(ThemeNavbar)
