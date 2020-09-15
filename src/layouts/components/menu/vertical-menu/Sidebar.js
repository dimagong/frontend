import React, {Component} from "react"
import classnames from "classnames"
import {ContextLayout} from "../../../../utility/context/Layout"
import {connect} from "react-redux"
import SidebarHeader from "./SidebarHeader"
import Hammer from "react-hammerjs"
import SideMenuContent from "./sidemenu/SideMenuContent"
import PerfectScrollbar from "react-perfect-scrollbar"
// import UserService from '../../../../services/user.service'
import {User} from "react-feather";

class Sidebar extends Component {

  constructor(props) {
    super(props);

    this.navBarRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.activePath !== state.activeItem) {
      return {
        activeItem: props.activePath
      }
    }
    // Return null if the state hasn't changed
    return null
  }

  state = {
    width: window.innerWidth,
    activeIndex: null,
    hoveredMenuItem: null,
    activeItem: this.props.activePath,
    menuShadow: false,
    ScrollbarTag: PerfectScrollbar
  }

  mounted = false

  updateWidth = () => {
    if (this.mounted) {
      this.setState(prevState => ({
        width: window.innerWidth
      }))
      this.checkDevice()
    }
  }

  componentDidMount() {
    this.mounted = true
    if (this.mounted) {
      if (window !== "undefined") {
        window.addEventListener("resize", this.updateWidth, false)
      }
      this.checkDevice()
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  checkDevice = () => {
    var prefixes = " -webkit- -moz- -o- -ms- ".split(" ")
    var mq = function (query) {
      return window.matchMedia(query).matches
    }

    if ("ontouchstart" in window || window.DocumentTouch) {
      this.setState({
        ScrollbarTag: "div"
      })
    } else {
      this.setState({
        ScrollbarTag: PerfectScrollbar
      })
    }
    var query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("")
    return mq(query)
  }

  changeActiveIndex = id => {
    if (id !== this.state.activeIndex) {
      this.setState({
        activeIndex: id
      })
    } else {
      this.setState({
        activeIndex: null
      })
    }
  }

  handleSidebarMouseEnter = id => {
    if (id !== this.state.hoveredMenuItem) {
      this.setState({
        hoveredMenuItem: id
      })
    } else {
      this.setState({
        hoveredMenuItem: null
      })
    }
  }

  handleActiveItem = url => {
    this.setState({
      activeItem: url
    })
  }

  render() {
    let {
      visibilityState,
      toggleSidebarMenu,
      sidebarHover,
      toggle,
      color,
      sidebarVisibility,
      activeTheme,
      collapsed,
      activePath,
      sidebarState,
      currentLang,
      permission,
      currentUser,
      collapsedMenuPaths
    } = this.props

    let {
      menuShadow,
      activeIndex,
      hoveredMenuItem,
      activeItem,
      ScrollbarTag
    } = this.state
    let scrollShadow = (container, dir) => {
      if (container && dir === "up" && container.scrollTop >= 100) {
        this.setState({menuShadow: true})
      } else if (container && dir === "down" && container.scrollTop < 100) {
        this.setState({menuShadow: false})
      } else {
        return
      }
    }

    // if (UserService.isOnboarding(this.props.userProfile)) {
    //   return null;
    // }
    //UserService.isOnboarding(this.props.userProfile, true)
    return (
      <ContextLayout.Consumer>
        {context => {
          let dir = context.state.direction;

          return (
            <React.Fragment>
              <Hammer
                onSwipe={e => {
                  sidebarVisibility()
                }}
                direction={
                  dir === "rtl" ? "DIRECTION_LEFT" : "DIRECTION_RIGHT"
                }>
                <div className="menu-swipe-area d-xl-none d-block vh-100"></div>
              </Hammer>

              <div
                ref={this.navBarRef}
                // className={classnames(
                //   `main-menu menu-fixed menu-light menu-accordion menu-shadow theme-${activeTheme}`,
                //   {
                //     collapsed: sidebarState === true,
                //     "hide-sidebar": this.state.width < 1200 && visibilityState === false,
                //     'd-none': UserService.isOnboarding(this.props.userProfile, true),
                //   },
                // )}
                onMouseEnter={() => sidebarHover(false)}
                onMouseLeave={() => sidebarHover(true)}>
                <SidebarHeader
                  toggleSidebarMenu={toggleSidebarMenu}
                  toggle={toggle}
                  sidebarBgColor={color}
                  sidebarVisibility={sidebarVisibility}
                  activeTheme={activeTheme}
                  collapsed={collapsed}
                  menuShadow={menuShadow}
                  activePath={activePath}
                  sidebarState={sidebarState}
                />
                <h2 className="bottom-logo">NMP</h2>
                <ScrollbarTag
                  className={classnames("main-menu-content", {
                    "overflow-hidden": ScrollbarTag !== "div",
                    "overflow-scroll": ScrollbarTag === "div"
                  })}
                  {...(ScrollbarTag !== "div" && {
                    options: {wheelPropagation: false},
                    onScrollDown: container => scrollShadow(container, "down"),
                    onScrollUp: container => scrollShadow(container, "up"),
                    onYReachStart: () =>
                      menuShadow === true &&
                      this.setState({menuShadow: false})
                  })}>
                  <Hammer
                    onSwipe={() => {
                      sidebarVisibility()
                    }}
                    direction={
                      dir === "rtl" ? "DIRECTION_RIGHT" : "DIRECTION_LEFT"
                    }>
                    <ul className="navigation navigation-main">
                      <SideMenuContent
                        setActiveIndex={this.changeActiveIndex}
                        activeIndex={activeIndex}
                        hoverIndex={hoveredMenuItem}
                        handleSidebarMouseEnter={this.handleSidebarMouseEnter}
                        activeItemState={activeItem}
                        handleActiveItem={this.handleActiveItem}
                        activePath={activePath}
                        lang={currentLang}
                        permission={permission}
                        currentUser={currentUser}
                        collapsedMenuPaths={collapsedMenuPaths}
                        toggleMenu={sidebarVisibility}
                        deviceWidth={this.props.deviceWidth}
                        userProfile={this.props.userProfile}
                      />
                    </ul>
                  </Hammer>
                </ScrollbarTag>
              </div>
            </React.Fragment>
          )
        }}
      </ContextLayout.Consumer>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.login.userRole,
    userProfile: state.user.profile
  }
};

export default connect(mapStateToProps)(Sidebar)
