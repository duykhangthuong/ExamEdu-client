import { Route, Switch, Redirect } from "react-router-dom";
import Exam from "pages/Student/Exam";
import React from "react";
import { useUserAuthorization } from "utilities/useAuthorization";
import StudentRoutes from "./StudentRoutes";
const ExamRoutes = () => {
    const { redirect, path } = useUserAuthorization("student");

    if (redirect) return <Redirect to={path} />;
    return (
        <>
            <Switch>
                {/* Chưa xong */}
                <Route path="/exam/:examId" exact>
                    <Exam />
                </Route>

                {/* Chưa xong */}
                <Route path="*" exact>
                    <StudentRoutes />
                </Route>
            </Switch>
        </>
    );
};

export default ExamRoutes;
