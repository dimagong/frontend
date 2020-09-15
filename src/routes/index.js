import React from "react";
import routes from "./route";
import { v4 } from "uuid";
import { Switch} from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./RouteProvider";
import { useSelector} from "react-redux"
import { selectAuth} from "app/selectors/authSelectors"

const Routes = ()=>{
    const isAuth = useSelector(selectAuth);

    return(
        <Switch>
                {routes.map((route) => {
                    const {  path, Component, exact, isPrivate, redirect } = route;

                    if (isPrivate) {
                        return (
                            <PrivateRoute path={path} exact={exact} key={v4()} redirect={redirect} isAuth={isAuth}>
                                <Component />
                            </PrivateRoute>
                        );
                    }
                    return (
                        <PublicRoute path={path} exact={exact} key={v4()} redirect={redirect} isAuth={isAuth}>
                            <Component />
                        </PublicRoute>
                    );
                })}
            </Switch>
    )
}
export default Routes;