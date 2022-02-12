import { Route, Switch, Redirect } from "react-router-dom";
import ExamSchedule from "pages/Student/ExamSchedule";
import KhaMinh from "pages/KhaMinh";
import React from "react";

import { useUserAuthorization } from "utilities/useAuthorization";
const ExamRoutes = () => {
    const { redirect, path } = useUserAuthorization("student");

    if (redirect) return <Redirect to={path} />;
    return (
        <>
            <Switch>
                {/* Chưa xong */}
                <Route path="/exam" exact>
                    <KhaMinh />
                </Route>
            </Switch>
        </>
    );
};

export default ExamRoutes;
