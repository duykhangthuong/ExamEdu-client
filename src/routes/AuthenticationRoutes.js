import React from "react";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import Login from "../pages/Login";

const AuthenticationRoutes = () => {
    return (
        <Switch>
            <Route path="/">
                <Login />
            </Route>
        </Switch>
    );
};

export default AuthenticationRoutes;
