import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";

import { UserService } from "features/user/services/userService";
import { useProfileQuery } from "features/user/queries/useProfileQuery";

import routes from "./routes";
import { selectAuth } from "../app/selectors";
import { RouteProvider } from "./RouteProvider";

const Routes = () => {
  const profileQuery = useProfileQuery();
  const { data: profile } = profileQuery;

  const isAuth = useSelector(selectAuth);
  const isMember = profile ? UserService.isProfileMember(profile) : false;
  const isManager = profile ? UserService.isProfileManager(profile) : false;

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
                isMember={isMember}
                isManager={isManager}
                isLoading={profileQuery.isLoading || profileQuery.data === undefined}
              />
            ) : (
              <RouteProvider.Public
                isAuth={isAuth}
                redirect={route.redirect}
                location={routeProps.location}
                Component={route.Component}
              />
            )
          }
        </Route>
      ))}
    </Switch>
  );
};

export default Routes;
