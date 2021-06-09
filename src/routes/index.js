import React, {useEffect} from "react";
import routes from "./routes";
import {v4} from "uuid";
import {Switch} from "react-router-dom";
import {PrivateRoute, PublicRoute} from "./RouteProvider";
import {useDispatch, useSelector} from "react-redux"
import {selectAuth} from "app/selectors/authSelectors"
import {selectProfile} from 'app/selectors'
import {userService} from 'services/user'
import {selectUserAbility} from '../app/selectors/userSelectors'
import {selectContext} from 'app/selectors'
import appSlice from "../app/slices/appSlice";
const {setContext} = appSlice.actions;

const Routes = () => {
  const isAuth = useSelector(selectAuth);
  const userRole = useSelector(selectUserAbility);
  const dispatch = useDispatch()
  const context = useSelector(selectContext)

  const isOnboarding = ["prospect", "adviser"].indexOf(userRole) !== -1;

  // if(isAuth && !profile) return null

   useEffect(() => {
    if (userRole && !isOnboarding && !context) {
      dispatch(setContext('Dashboard'))
    }
  }, [userRole]);
  return (
    <Switch>
      {routes.map((route) => {
        const {path, Component, exact, isPrivate, redirect, ...rest} = route;

        if (isPrivate) {

          return (
            <PrivateRoute isOnboarding={isOnboarding} path={path} exact={exact} key={v4()} redirect={redirect}
                          isAuth={isAuth} Component={Component} {...rest}/>
          );
        }

        return (
          <PublicRoute path={path} exact={exact} key={v4()} redirect={redirect} isAuth={isAuth}
                       Component={Component} {...rest}/>
        );
      })}
    </Switch>
  )
};
export default Routes;
