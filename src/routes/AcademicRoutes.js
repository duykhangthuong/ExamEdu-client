import { Route, Switch, Redirect } from "react-router-dom";
import HorizontalNavBar from "components/HorizontalNavBar";
import VerticalNavBar from "components/VerticalNavBar";
import { DataAcademic } from "utilities/VerticalNavbarData";
import React from "react";

import { useUserAuthorization } from "utilities/useAuthorization";
import ModuleList from "pages/AcademicDepartment/ModuleList";
const AcademicRoutes = () => {
    const { redirect, path } = useUserAuthorization("academicdepartment");

    if (redirect) return <Redirect to={path} />;
    return (
        <>
            <HorizontalNavBar />
            <VerticalNavBar VerticalNavbarData={DataAcademic} />
            <Switch>
                <Route path="/academic/module/list" exact>
                    <ModuleList />
                </Route>
                <Route path="/academic/class/list" exact></Route>
                <Route path="/academic/class/create" exact></Route>
                <Route path="/academic/class/update" exact></Route>
                <Route path="/academic/class" exact></Route>
                <Route path="/academic/exam/list" exact></Route>
                <Route path="/academic/exam/create" exact></Route>
                <Route path="/academic/exam/update" exact></Route>
                <Route path="*"></Route>
            </Switch>
        </>
    );
};

export default AcademicRoutes;
