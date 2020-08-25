import React, { Suspense, lazy } from "react"
import { Router, Switch, Route } from "react-router-dom"
import { history } from "./history"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"
import { ContextLayout } from "./utility/context/Layout"

const home = lazy(() => import("./views/pages/home/Home"));
const forgotPassword = lazy(() =>
  import("./views/pages/authentication/ForgotPassword")
)
// User
const userManagement = lazy(() => import("./views/pages/user-management/UserManagement"));
const userCreate = lazy(() => import("./views/pages/user-management/UserCreate"));
const userList = lazy(() => import("./views/pages/user-management/UserList"));
const userEdit = lazy(() => import("./views/pages/user-management/UserEdit"));

// invitation
const invitationCreate = lazy(() => import("./views/pages/invitation/InvitationCreate"));
const invitationList = lazy(() => import("./views/pages/invitation/InvitationList"));
const invitationAccept = lazy(() => import("./views/pages/invitation/InvitationAccept"));


// onboarding
const workflow = lazy(() => import("./views/pages/onboarding/Workflow"));
const notification = lazy(() => import("./views/pages/onboarding/Notification"));
const dForm = lazy(() => import("./views/pages/onboarding/DForm"));
const onboardingForm = lazy(() => import("./views/pages/onboarding/OnboardingForm"));


const error404 = lazy(() => import("./views/pages/misc/error/404"))

const Login = lazy(() => import("./views/pages/authentication/login/Login"))

// Set Layout and Component Using App Route
const RouteConfig = ({ component: Component, fullLayout, ...rest }) => {

  if (!localStorage.getItem('token') && rest.location.pathname === '/') {
    return (<Redirect to="/login"></Redirect>)
  }

  if (localStorage.getItem('token') && rest.location.pathname === '/login') {
    return (<Redirect to="/"></Redirect>)
  }

  const renderDefault = props => {
    return (
      <ContextLayout.Consumer>
        {context => {

          let LayoutTag =
            fullLayout === true
              ? context.fullLayout
              : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout
          return (
            <LayoutTag {...props} permission={props.user}>
              <Suspense fallback={<Spinner />}>
                <Component {...props} />
              </Suspense>
            </LayoutTag>
          )
        }}
      </ContextLayout.Consumer>
    )
  };

  const defaultRoute = <Route
    {...rest}
    render={renderDefault}
  />

  return defaultRoute;
}

// Set Layout and Component Using App Route
const RouteAnnonConfig = ({ component: Component, fullLayout, ...rest }) => {

  const renderAnnon = props => {
    return (
      <ContextLayout.Consumer>
        {context => {

          let LayoutTag =
            fullLayout === true
              ? context.fullLayout
              : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout
          return (
            <LayoutTag {...props} permission={props.user}>
              <Suspense fallback={<Spinner />}>
                <Component {...props} />
              </Suspense>
            </LayoutTag>
          )
        }}
      </ContextLayout.Consumer>
    )
  };

  const AnnonRoute = <Route
    {...rest}
    render={renderAnnon}
  />

  return AnnonRoute;
}

const mapStateToProps = state => {
  return {
    user: state.auth.login.userRole
  }
}

const AppRoute = connect(mapStateToProps)(RouteConfig)

class AppRouter extends React.Component {

  constructor() {
    super();


  }

  componentWillMount() {

    // axios.get("/api/user/profile").then(userProfile => {
    //   store.dispatch({
    //     type: "LOGIN_WITH_JWT",
    //     payload: { user: userProfile.data.data, loggedType: "jwt" }
    //   })
    // }).catch(() => {
    //   localStorage.removeItem('token');
    //   setTimeout(() => {
    //     history.push('/login')
    //   })
    // });

  }
  componentWillUnmount() {

  }

  loginEnter = () => {

  }

  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
          <AppRoute exact path="/" component={home} />
          <AppRoute
            path="/user-management"
            exact
            component={userManagement} />
          <AppRoute
            path="/user/create"
            exact
            component={userCreate} />
          <AppRoute
            path="/user/list"
            exact
            component={userList} />
          <AppRoute
            path="/user/:id/edit"
            exact
            component={userEdit} />

          <AppRoute
            path="/invitation/create"
            exact
            component={invitationCreate} />
          <AppRoute
            path="/invitation/list"
            exact
            component={invitationList} />
          <RouteAnnonConfig
            path="/invitation-accept/:id"
            exact
            fullLayout
            component={invitationAccept} />

          <AppRoute
            path="/onboarding/workflows"
            exact
            component={workflow} />
          <AppRoute
            path="/onboarding/dforms"
            exact
            component={dForm} />
          <AppRoute
            path="/onboarding/notifications"
            exact
            component={notification} />

          <AppRoute
            path="/onboarding-process"
            exact
            component={onboardingForm} />

          <AppRoute
            path="/forgot-password"
            component={forgotPassword}
            fullLayout
          />

          <AppRoute path="/misc/error/404" component={error404} fullLayout />
          <AppRoute path="/login" component={Login} fullLayout />
          <AppRoute component={error404} fullLayout />
        </Switch>
      </Router>
    )
  }
}

export default AppRouter
