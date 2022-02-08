import { Route, Switch, Redirect } from "react-router-dom";
import HorizontalNavBar from "components/HorizontalNavBar";
import VerticalNavBar from "components/VerticalNavBar";
import ExamSchedule from "pages/Student/ExamSchedule";
import React from "react";
import { DataTeacher } from "utilities/VerticalNavbarData";
import { useUserAuthorization } from "utilities/useAuthorization";
const TeacherRoutes = () => {
    const { redirect, path } = useUserAuthorization("teacher");

    if (redirect) return <Redirect to={path} />;
    return (
        <>
            <HorizontalNavBar />
            <VerticalNavBar VerticalNavbarData={DataTeacher} />
            <Switch>
                <Route path="/teacher/exam/create/info" exact></Route>
                <Route path="/teacher/exam/create/question" exact></Route>
                <Route path="/teacher/question" exact></Route>
                <Route path="/teacher/exam/list" exact></Route>
                <Route path="/teacher/exam/list/result" exact></Route>
                <Route path="/teacher/class/list" exact></Route>
                <Route path="*"></Route>
            </Switch>
        </>
    );
};

export default TeacherRoutes;
