import { Route, Switch, Redirect } from "react-router-dom";

import React from "react";

import { useUserAuthorization } from "utilities/useAuthorization";
import PrejoinRoom from "pages/Student/PrejoinRoom";
const PrejoinRoomRoutes = () => {
    const { redirect, path } = useUserAuthorization("student");

    if (redirect) return <Redirect to={path} />;
    return (
        <>
            <Switch>
                {/* Chưa xong */}
                <Route path="/prejoin/:examId" exact>
                    <PrejoinRoom />
                </Route>
            </Switch>
        </>
    );
};

export default PrejoinRoomRoutes;
