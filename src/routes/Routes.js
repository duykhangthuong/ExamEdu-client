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
import MarkReport from "pages/Student/MarkReport";
import ModuleList from "pages/Student/ModuleList";
import AcademicRoutes from "./AcademicRoutes";
import InvigilationRoutes from "./InvigilationRoutes";
import PrejoinRoomRoutes from "./PrejoinRoomRoutes";

const Routes = () => {
    return (
        <Switch>
            <Route path="/administrator">
                <AdministratorRoutes />
            </Route>

            <Route path="/student">
                <StudentRoutes />
            </Route>
            <Route path="/AcademicDepartment">
                <AcademicRoutes />
            </Route>

            <Route path="/logout">
                <Logout />
            </Route>
            <Route path="/exam">
                <ExamRoutes />
            </Route>

            <Route path="/invigilate">
                <InvigilationRoutes />
            </Route>
            <Route path="/prejoin">
                <PrejoinRoomRoutes />
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
