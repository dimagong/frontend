import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({
  children,
  redirect,
  isAuth,
  ...rest
}) => {

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (isAuth) return children;
        else {
          return (
            <Redirect
              to={{
                pathname: redirect,
                state: { from: location },
              }}
            />
          );
        }
      }}
    />
  );
};

export const PublicRoute = ({children, redirect, isAuth, ...rest}) => {
  
    return( 
        <Route
            {...rest}
            render={({ location }) => {
                if (isAuth && redirect)
                    return (
                        <Redirect
                            to={{
                                pathname: redirect,
                                state: { from: location }
                            }}
                        />
                    );
                else {
                    return children;
                }
            }}
        />
    )
};
