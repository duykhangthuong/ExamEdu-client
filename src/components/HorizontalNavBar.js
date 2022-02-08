import React from "react";
import Icon from "./Icon";
import styles from "../styles/HorizontalNavBar.module.css";
import logo from "../static/logo-ExamEdu.png";
import { useLazyFetch } from "utilities/useFetch";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const HorizontalNavBar = () => {
    const history = useHistory();
    const name = "Kha Minh Ho";
    // Handle Logout
    const [fetchData] = useLazyFetch(`https://localhost:5001/api/auth/logout`, {
        method: "POST",
        body: {},
    });

    const handleLogout = () => {
        fetchData();
        history.push({
            pathname: "/logout",
            state: {
                logout: "logout",
            },
        });
    };
    return (
        <nav className={`shadow-heavy pe-2 ps-3 py-2 ${styles.navbar} `}>
            {/* <div className="d-flex justify-content-end align-items-center txt-gray"> */}
            {/* Logo */}
            <div
                className={`d-flex align-items-center justify-content-center d-md-none ${styles.grid_c23}`}
            >
                <img src={logo} className={styles.logo} />
                <div className={styles.teal}>ExamEdu</div>
            </div>
            {/* Welcome message */}
            <div className="d-none d-md-block me-3">Hi! {name}</div>
            {/* Notification bell */}
            <div
                className={`d-flex justify-content-end align-items-center ${styles.grid_c34}`}
            >
                <div
                    className={`shadow-light me-3 ${styles.icon_container} ${styles.bell_container}`}
                >
                    <Icon icon="bell" />
                    {/* Notification dot */}
                    <div className={`${styles.notif_dot}`}></div>
                </div>
                {/* Avatar */}
                <div
                    className={`shadow-light me-md-3 ${styles.avatar_container}`}
                >
                    <img
                        src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"
                        className={styles.avatar}
                        alt="Avatar"
                    />
                </div>

                {/* Log out button */}
                <div
                    className={`shadow-light d-none d-md-flex ${styles.icon_container}`}
                    onClick={handleLogout}
                >
                    <Icon
                        icon="power-off"
                        className={styles.log_out_btn}
                    ></Icon>
                </div>
            </div>
            {/* </div> */}
        </nav>
    );
};

export default HorizontalNavBar;
