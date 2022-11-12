import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectAuth } from "app/selectors/authSelectors";
import { selectProfile } from "app/selectors/userSelectors";

import routes from "./routes";
import authService from "../services/auth";
import { UserService } from "../services/user";
import { RouteProvider } from "./RouteProvider";

const { getProfileRequest } = appSlice.actions;

const Routes = () => {
  const dispatch = useDispatch();

  const isAuth = useSelector(selectAuth);
  const profile = useSelector(selectProfile);

  const token = authService.getToken();
  const isMember = profile ? UserService.isMember(profile) : false;
  const isManager = profile ? UserService.isManager(profile) : false;

  useEffect(() => {
    if (token) {
      dispatch(getProfileRequest());
    }
  }, []);

  return (
    <Switch>
      {routes.map((route) => (
        <Route path={route.path} exact={route.exact} key={route.path}>
          {(routeProps) =>
            route.isPrivate ? (
              <RouteProvider.Private
                path={route.path}
                isAuth={isAuth}
                redirect={route.redirect}
                location={routeProps.location}
                Component={route.Component}
                isFullLayout={route.isFullLayout}
                isMember={isMember}
                isManager={isManager}
              />
            ) : (
              <RouteProvider.Public
                isAuth={isAuth}
                redirect={route.redirect}
                location={routeProps.location}
                Component={route.Component}
                isFullLayout={route.isFullLayout}
              />
            )
          }
        </Route>
      ))}
    </Switch>
  );
};

export default Routes;
