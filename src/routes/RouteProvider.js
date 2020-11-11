import React from "react";
import {Route, Redirect} from "react-router-dom";
import {ContextLayout} from "utility/context/Layout"
import {
  loginPath,
  userManagmentPath,
} from "constants/paths";

const renderDefault = ({fullLayout, Component}) => props => {
  return (
    <ContextLayout.Consumer>
      {context => {

        let LayoutTag =
          fullLayout === true
            ? context.fullLayout
            : context.state.activeLayout === "horizontal"
            ? context.horizontalLayout
            : context.VerticalLayout;
        return (
          <LayoutTag {...props} permission={props.user}>
            <Component {...props} />
          </LayoutTag>
        )
      }}
    </ContextLayout.Consumer>
  )
};


export const PrivateRoute = ({Component, redirect, isAuth, fullLayout, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuth) return renderDefault({fullLayout, Component})(props);
        else {
          return (
            <Redirect
              to={{
                pathname: redirect,
                state: {from: props.location},
              }}
            />
          );
        }
      }}
    />
  );
};

export const PublicRoute = ({Component, redirect, isAuth, fullLayout, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!Component) {
          return (
            <Redirect
              to={{
                pathname: isAuth ? userManagmentPath : loginPath,
                state: {from: props.location},
              }}
            />
          );
        }

        if (isAuth && redirect) {

          return (
            <Redirect
              to={{
                pathname: redirect,
                state: {from: props.location},
              }}
            />
          )
        } else {
          return (
            renderDefault({fullLayout, Component})(props)
          );
        }
      }}
    />
  );
};
