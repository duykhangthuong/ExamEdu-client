import { Route, Switch, Redirect } from "react-router-dom";

import React from "react";

import { useUserAuthorization } from "utilities/useAuthorization";
import StudentRoutes from "./StudentRoutes";
import Invigilate from "pages/Teacher/Invigilate";
const InvigilationRoutes = () => {
    const { redirect, path } = useUserAuthorization("teacher");

    if (redirect) return <Redirect to={path} />;
    return (
        <>
            <Switch>
                {/* Chưa xong */}
                <Route path="/invigilate" exact>
                    <Invigilate />
                </Route>
            </Switch>
        </>
    );
};

export default InvigilationRoutes;
