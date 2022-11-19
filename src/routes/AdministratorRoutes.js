import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AccountList from "pages/Administrator/AccountList";
import CreateAccount from "pages/Administrator/CreateAccount";
import DeactivatedAccountList from "pages/Administrator/DeactivatedAccountList";

import HorizontalNavBar from "components/HorizontalNavBar";
import VerticalNavBar from "components/VerticalNavBar";
import { useUserAuthorization } from "utilities/useAuthorization";
import { DataAdministrator } from "utilities/VerticalNavbarData";

const AdministratorRoutes = () => {
    const { redirect, path } = useUserAuthorization("administrator");

    if (redirect) return <Redirect to={path} />;
    return (
        <>
            <HorizontalNavBar />
            <VerticalNavBar VerticalNavbarData={DataAdministrator} />

            <Switch>
                <Route path="/administrator/accounts/create" exact>
                    <CreateAccount />
                </Route>

                <Route path="/administrator/accounts/deactivated" exact>
                    <DeactivatedAccountList />
                </Route>

                <Route path="/administrator/accounts" exact>
                    <AccountList />
                </Route>

                <Route path="*">
                    <AccountList />
                </Route>
            </Switch>
        </>
    );
};

export default AdministratorRoutes;
