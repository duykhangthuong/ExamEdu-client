import React from "react";
import Icon from "components/Icon";
import style from "../styles/VerticalNavBar.module.css";
import { NavLink } from "react-router-dom";
// export const VerticalNavbarData = [
//     {
//         title: "Account List",
//         path: "/administrator/accounts",
//         icon: <Icon icon="list" className="" size="2x"></Icon>,
//     },
//     {
//         title: "Create Account",
//         path: "/administrator/accounts/create",
//         icon: <Icon icon="user-plus" className="" size="2x"></Icon>,
//     },
//     {
//         title: "Account History",
//         path: "/administrator/accounts/deactivated",
//         icon: <Icon icon="save" className="" size="2x"></Icon>,
//     },
// ];
export const VerticalNavbarData = [
    {
        link: (
            <NavLink
                className="d-flex flex-sm-row flex-md-column"
                to="/administrator/accounts"
                activeClassName={style.active_link}
                exact={true}
            >
                <div className={style.icon}>
                    <Icon icon="list" className="" size="2x"></Icon>
                </div>
                <div className={style.title}>Account List</div>
            </NavLink>
        ),
    },
    {
        link: (
            <NavLink
                className="d-flex flex-sm-row flex-md-column"
                to="/administrator/accounts/create"
                activeClassName={style.active_link}
                exact={true}
            >
                <div className={style.icon}>
                    <Icon icon="user-plus" className="" size="2x"></Icon>
                </div>
                <div className={style.title}>Create Account</div>
            </NavLink>
        ),
    },
    {
        link: (
            <NavLink
                className="d-flex flex-sm-row flex-md-column"
                to="/administrator/accounts/deactivated"
                activeClassName={style.active_link}
                exact={true}
            >
                <div className={style.icon}>
                    <Icon icon="save" className="" size="2x"></Icon>
                </div>
                <div className={style.title}>Account History</div>
            </NavLink>
        ),
    },
];
