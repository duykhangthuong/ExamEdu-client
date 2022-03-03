import { Route, Switch, Redirect } from "react-router-dom";
import HorizontalNavBar from "components/HorizontalNavBar";
import VerticalNavBar from "components/VerticalNavBar";
import React from "react";
import { DataTeacher } from "utilities/VerticalNavbarData";
import { useUserAuthorization } from "utilities/useAuthorization";
import CreateExamPaper from "pages/Teacher/CreateExamPaper";
import ExamList from "pages/Teacher/ExamList";
import ModuleList from "pages/Teacher/ModuleList";
import ExamResult from "pages/Teacher/ExamResult";
import CreateExam from "pages/Teacher/CreateExam";
const TeacherRoutes = () => {
    const { redirect, path } = useUserAuthorization("teacher");

    if (redirect) return <Redirect to={path} />;
    return (
        <>
            <HorizontalNavBar />
            <VerticalNavBar VerticalNavbarData={DataTeacher} />

            <Switch>
                {/* Create Exam info */}
                <Route path="/teacher/exam/create/info" exact>
                    <CreateExam />
                </Route>

                {/* Create Exam Paper */}
                <Route
                    path="/teacher/exam/create/question/:ExamID/:moduleId/:isFinalExam"
                    exact
                >
                    <CreateExamPaper />
                </Route>

                <Route path="/teacher/question" exact></Route>

                {/* Exam result of a class */}
                <Route path="/teacher/exam/list/result/:ExamID/:ModuleID" exact>
                    <ExamResult />
                </Route>

                {/* Module list of a teacher */}
                <Route path="/teacher/module/list" exact>
                    <ModuleList />
                </Route>

                {/* Exam list of a teacher */}
                <Route path="/teacher/class/progress_exam/:classModuleId" exact>
                    <ExamList />
                </Route>
                {/* Default Route */}
                <Route path="*">
                    <ModuleList />
                </Route>
               
                <Route path="*"></Route>
            </Switch>
        </>
    );
};

export default TeacherRoutes;
