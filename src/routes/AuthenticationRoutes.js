import ForgotPassword from "pages/Authentication/ForgotPassword";
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useAuthentication } from "utilities/useAuthorization";
import Login from "../pages/Authentication/Login";

const AuthenticationRoutes = () => {
    const { redirect, path } = useAuthentication();

    if (redirect) return <Redirect to={path} />;

    return (
        <Switch>
            <Route path="/">
                <Login />
            </Route>
        </Switch>
    );
};

export default AuthenticationRoutes;
