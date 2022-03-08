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
import AddQuestionRequest from "pages/Teacher/AddQuestionRequest";
import RequestAddQuestionBank from "pages/Teacher/RequestAddQuestionBank";
import RequestAddQuestionList from "pages/Teacher/RequestAddQuestionList";
import ApproveRequests from "pages/Teacher/ApproveRequests";
import Wrapper from "components/Wrapper";
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

                {/* Add Question to Bank */}
                <Route path="/teacher/question" exact>
                    <AddQuestionRequest />
                </Route>

                {/* Trưởng bộ môn phân công duyệt duyệt request */}
                <Route path="/teacher/question/assign" exact>
                    <RequestAddQuestionBank />
                </Route>

                {/* Xem các request đã được giao */}
                <Route path="/teacher/question/request" exact>
                    <RequestAddQuestionList />
                </Route>

                {/* Xử lí request add question */}
                <Route path="/teacher/question/process/:requestId" exact>
                    <ApproveRequests />
                </Route>

                {/* Exam result of a class */}
                <Route
                    path="/teacher/exam/list/result/:ExamID/:classModuleId"
                    exact
                >
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

                {/* Head of department view request add question */}
                <Route path="/teacher/question/request" exact></Route>

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
