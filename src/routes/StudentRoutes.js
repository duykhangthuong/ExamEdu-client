import HorizontalNavBar from "components/HorizontalNavBar";
import ExamSchedule from "pages/Student/ExamSchedule";

import MarkReport from "pages/Student/MarkReport";
import React from "react";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";

const StudentRoutes = () => {
    return (
        <>
            <HorizontalNavBar />
            <Switch>
                <Route path="/student/ExamSchedule">
                    <ExamSchedule />
                </Route>

                <Route path="/student/MarkReport">
                    <MarkReport />
                </Route>
            </Switch>
        </>
    );
};

export default StudentRoutes;
