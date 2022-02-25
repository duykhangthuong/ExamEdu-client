import React from "react";
import { Route, Switch } from "react-router-dom";

import AdministratorRoutes from "./AdministratorRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";
import StudentRoutes from "./StudentRoutes";
import Logout from "pages/Authentication/Logout";
import ErrorPage from "pages/ErrorPage";
import ExamRoutes from "./ExamRoutes";
import TeacherRoutes from "./TeacherRoutes";
import KhaMinh from "pages/KhaMinh";

const Routes = () => {
    return (
        <Switch>
            <Route path="/administrator">
                <AdministratorRoutes />
            </Route>

            <Route path="/student">
                <StudentRoutes />
            </Route>

            <Route path="/logout">
                <Logout />
            </Route>
            <Route path="/exam">
                <ExamRoutes />
            </Route>

            <Route path="/teacher">
                <TeacherRoutes />
            </Route>

            <Route path="/">
                {/* <KhaMinh /> */}
                <AuthenticationRoutes />
            </Route>
            <Route path="*">
                <ErrorPage />
            </Route>
            <Route path="*">
                <ErrorPage />
            </Route>
        </Switch>
    );
};

export default Routes;
