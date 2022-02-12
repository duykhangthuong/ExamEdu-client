import { Route, Switch, Redirect } from "react-router-dom";
import HorizontalNavBar from "components/HorizontalNavBar";
import VerticalNavBar from "components/VerticalNavBar";
import ExamSchedule from "pages/Student/ExamSchedule";

import MarkReport from "pages/Student/MarkReport";
import React from "react";

import { useUserAuthorization } from "utilities/useAuthorization";
import { DataStudent } from "utilities/VerticalNavbarData";
import ExamRoutes from "./ExamRoutes";
const StudentRoutes = () => {
    const { redirect, path } = useUserAuthorization("student");

    if (redirect) return <Redirect to={path} />;
    return (
        <>
            <HorizontalNavBar />
            <VerticalNavBar VerticalNavbarData={DataStudent} />
            <Switch>
                <Route path="/student/exam/schedule" exact>
                    <ExamSchedule />
                </Route>

                {/* Chưa xong */}
                <Route path="/students/exam">
                    <ExamRoutes />
                </Route>

                <Route path="/student/module/list" exact>
                    <ExamSchedule />
                </Route>

                <Route path="/student/mark/report" exact>
                    <MarkReport />
                </Route>
                {/* <Route path="*">
                    <ExamSchedule />
                </Route> */}
            </Switch>
        </>
    );
};

export default StudentRoutes;
