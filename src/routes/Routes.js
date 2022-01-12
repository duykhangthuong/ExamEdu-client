import { Route, Switch } from "react-router-dom";
import AuthenticationRoutes from "./AuthenticationRoutes";

const Routes = () => {
    return (
        <Switch>
            <Route path="/">
                <AuthenticationRoutes />
            </Route>
        </Switch>
    );
};

export default Routes;
