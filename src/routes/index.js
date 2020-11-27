import React from "react";
import routes from "./routes";
import { v4 } from "uuid";
import { Switch } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./RouteProvider";
import { useSelector} from "react-redux"
import { selectAuth} from "app/selectors/authSelectors"
import {selectProfile} from 'app/selectors'
import {userService} from 'services/user'

const Routes = ()=>{
    const isAuth = useSelector(selectAuth);
    const profile = useSelector(selectProfile);

    const isOnboarding = userService.isOnboarding(profile)

    if(isAuth && !profile) return null

    return(
        <Switch>
                {routes.map((route) => {
                    const {  path, Component, exact, isPrivate, redirect, ...rest } = route;



                    if (isPrivate) {

                        return (
                            <PrivateRoute isOnboarding={isOnboarding} path={path} exact={exact} key={v4()} redirect={redirect} isAuth={isAuth} Component={Component} {...rest}/>
                        );
                    }

                    return (
                        <PublicRoute path={path} exact={exact} key={v4()} redirect={redirect} isAuth={isAuth} Component={Component} {...rest}/>
                    );
                })}
            </Switch>
    )
}
export default Routes;
