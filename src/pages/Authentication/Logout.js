import React from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { logout } from "store/action";

const Logout = () => {
    // Get state on location
    const location = useLocation();

    // Handle clear redux store
    const dispatch = useDispatch();

    // To handle redirect
    const history = useHistory();

    // If location have state (passed from logout button) => logout
    if (location.state?.logout) {
        dispatch(logout());
        window.location.replace("/");
    } else {
        history.goBack();
    }

    return <></>;
};

export default Logout;
