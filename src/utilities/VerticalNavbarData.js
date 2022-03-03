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
export const DataAdministrator = [
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

export const DataStudent = [
    {
        link: (
            <NavLink
                className="d-flex flex-sm-row flex-md-column"
                to="/student/exam/schedule"
                activeClassName={style.active_link}
                exact={true}
            >
                <div className={style.icon}>
                    <Icon icon="calendar-day" className="" size="2x"></Icon>
                </div>
                <div className={style.title}>View Exam Schedule</div>
            </NavLink>
        ),
    },
    {
        link: (
            <NavLink
                className="d-flex flex-sm-row flex-md-column"
                to="/student/module/list"
                activeClassName={style.active_link}
                exact={true}
            >
                <div className={style.icon}>
                    <Icon icon="clipboard-check" className="" size="2x"></Icon>
                </div>
                <div className={style.title}>Mark Report</div>
            </NavLink>
        ),
    },
];

export const DataTeacher = [
    {
        link: (
            <NavLink
                className="d-flex flex-sm-row flex-md-column"
                to="/teacher/exam/create/info"
                activeClassName={style.active_link}
                exact={true}
            >
                <div className={style.icon}>
                    <Icon icon="file-alt" className="" size="2x"></Icon>
                </div>
                <div className={style.title}>Create Exam</div>
            </NavLink>
        ),
    },
    {
        link: (
            <NavLink
                className="d-flex flex-sm-row flex-md-column"
                to="/teacher/module/list"
                activeClassName={style.active_link}
                exact={true}
            >
                <div className={style.icon}>
                    <Icon icon="id-card" className="" size="2x"></Icon>
                </div>
                <div className={style.title}>Module</div>
            </NavLink>
        ),
    },
    {
        link: (
            <NavLink
                className="d-flex flex-sm-row flex-md-column"
                to="/teacher/question"
                activeClassName={style.active_link}
                exact={true}
            >
                <div className={style.icon}>
                    <Icon icon="folder-plus" className="" size="2x"></Icon>
                </div>
                <div className={style.title}>Question Bank</div>
            </NavLink>
        ),
    },
];

export const DataAcademic = [
    {
        link: (
            <NavLink
                className="d-flex flex-sm-row flex-md-column"
                to="/academic/module"
                activeClassName={style.active_link}
                exact={true}
            >
                <div className={style.icon}>
                    <Icon icon="copy" className="" size="2x"></Icon>
                </div>
                <div className={style.title}>Module</div>
            </NavLink>
        ),
    },
    {
        link: (
            <NavLink
                className="d-flex flex-sm-row flex-md-column"
                to="/academic/class"
                activeClassName={style.active_link}
                exact={true}
            >
                <div className={style.icon}>
                    <Icon icon="id-card" className="" size="2x"></Icon>
                </div>
                <div className={style.title}>Class</div>
            </NavLink>
        ),
    },
    {
        link: (
            <NavLink
                className="d-flex flex-sm-row flex-md-column"
                to="/academic/exam"
                activeClassName={style.active_link}
                exact={true}
            >
                <div className={style.icon}>
                    <Icon icon="file-alt" className="" size="2x"></Icon>
                </div>
                <div className={style.title}>Exam</div>
            </NavLink>
        ),
    },
];
