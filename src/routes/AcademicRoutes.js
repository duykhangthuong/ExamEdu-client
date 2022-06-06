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
                <Route path="/AcademicDepartment/class/:classId" exact>
                    <ClassDetail />
                </Route>
                <Route path="/AcademicDepartment/class/:classId/module/:moduleId" exact>
                    <ClassModuleStudent/>
                </Route>
                {/* <Route path="/academic/class/create" exact></Route>
                
                
                <Route path="/academic/exam/list" exact></Route>
                <Route path="/academic/exam/create" exact></Route>
                <Route path="/academic/exam/update" exact></Route> */}

                <Route path="*">
                    <ModuleList />
                </Route>
            </Switch>
        </>
    );
};

export default AcademicRoutes;
