import { Route, Switch, Redirect } from "react-router-dom";

import Exam from "pages/Student/Exam";
import React from "react";

import { useUserAuthorization } from "utilities/useAuthorization";
const ExamRoutes = () => {
    const { redirect, path } = useUserAuthorization("student");

    if (redirect) return <Redirect to={path} />;
    return (
        <>
            <Switch>
                
                {/* Chưa xong */}
                <Route path="/exam/test" exact>
                    <Exam />
                </Route>
               
            </Switch>
        </>
    );
};

export default ExamRoutes;
