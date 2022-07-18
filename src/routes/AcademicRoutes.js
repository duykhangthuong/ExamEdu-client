import { Route, Switch, Redirect } from "react-router-dom";
import HorizontalNavBar from "components/HorizontalNavBar";
import VerticalNavBar from "components/VerticalNavBar";
import { DataAcademic } from "utilities/VerticalNavbarData";
import React from "react";
import { useUserAuthorization } from "utilities/useAuthorization";
import ModuleList from "pages/AcademicDepartment/ModuleList";
import ClassList from "pages/AcademicDepartment/ClassList";
import ClassDetail from "pages/AcademicDepartment/ClassDetail";
import ClassModuleStudent from "pages/AcademicDepartment/ClassModuleStudent";
import UpdateExam from "pages/AcademicDepartment/UpdateExam";
import ExamList from "pages/AcademicDepartment/ExamList";
import ExamDetail from "pages/AcademicDepartment/ExamDetail";
import CreateExam from "pages/Teacher/CreateExam";
import CreateExamPaper from "pages/Teacher/CreateExamPaper";
import CreateClass from "pages/AcademicDepartment/CreateClass";
const AcademicRoutes = () => {
    const { redirect, path } = useUserAuthorization("academicdepartment");

    if (redirect) return <Redirect to={path} />;
    return (
        <>
            <HorizontalNavBar />
            <VerticalNavBar VerticalNavbarData={DataAcademic} />
            <Switch>
                <Route path="/AcademicDepartment/module/list" exact>
                    <ModuleList />
                </Route>

                <Route path="/AcademicDepartment/class/" exact>
                    <ClassList />
                </Route>
                <Route path="/AcademicDepartment/exam" exact>
                    <ExamList />
                </Route>
                <Route path="/AcademicDepartment/class/:classId" exact>
                    <ClassDetail />
                </Route>
                <Route path="/AcademicDepartment/class/:classId/module/:moduleId" exact>
                    <ClassModuleStudent/>
                </Route>
                <Route path="/AcademicDepartment/exam/:examId" exact>
                    <ExamDetail />
                </Route>
                <Route path="/AcademicDepartment/class/create/info" exact>
                    <CreateClass />
                </Route>

                {/* <Route path="/academic/class/create" exact></Route>
                
                
                <Route path="/academic/exam/list" exact></Route>
                <Route path="/academic/exam/create" exact></Route>
                <Route path="/academic/exam/update" exact></Route> */}

                <Route
                    path="/AcademicDepartment/exam/create/question/:ExamID/:moduleId/:isFinalExam"
                    exact
                >
                    <CreateExamPaper />
                </Route>

                <Route path="/AcademicDepartment/exam/create/info" exact>
                    <CreateExam isFinalExam={true} />
                </Route>

                <Route
                    path="/AcademicDepartment/exam/update/info/:examId"
                    exact
                >
                    <UpdateExam isFinalExam={true} />
                </Route>

                <Route path="*">
                    <ModuleList />
                </Route>
            </Switch>
        </>
    );
};

export default AcademicRoutes;
