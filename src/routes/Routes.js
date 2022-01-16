import React from "react";

import { Route, Switch } from "react-router-dom";
import AdministratorRoutes from "./AdministratorRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";
import StudentRoutes from "./StudentRoutes";

const Routes = () => {
    return (
        <Switch>
            <Route path="/administrator">
                <AdministratorRoutes />
            </Route>

            <Route path="/student">
                <StudentRoutes />
            </Route>

            <Route path="/">
                <AuthenticationRoutes />
            </Route>
        </Switch>
    );
};

export default Routes;
