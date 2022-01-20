import React from "react";

import AccountList from "pages/Administrator/AccountList";
import CreateAccount from "pages/Administrator/CreateAccount";
import DeactivateAccount from "pages/Administrator/DeactivateAccount";
import DeactivatedAccountList from "pages/Administrator/DeactivatedAccountList";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import HorizontalNavBar from "components/HorizontalNavBar";
import VerticalNavBar from "components/VerticalNavBar";

const AdministratorRoutes = () => {
    return (
        <>
            <HorizontalNavBar />
            <VerticalNavBar />

            <Switch>
                <Route path="/administrator/accounts/create">
                    <CreateAccount />
                </Route>

                <Route path="/administrator/accounts/deactivate">
                    <DeactivateAccount />
                </Route>

                <Route path="/administrator/accounts/deactivated">
                    <DeactivatedAccountList />
                </Route>

                <Route path="/administrator/accounts">
                    <AccountList />
                </Route>
            </Switch>
        </>
    );
};

export default AdministratorRoutes;
