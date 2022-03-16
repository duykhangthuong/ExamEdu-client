import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import styles from "../styles/HorizontalNavBar.module.css";
import logo from "../static/logo-ExamEdu.png";
import { useLazyFetch } from "utilities/useFetch";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { API } from "utilities/constants";
import { HubConnectionBuilder } from "@microsoft/signalr";
import moment from "moment";

const HorizontalNavBar = () => {
    const history = useHistory();
    const [connection, setConnection] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const user = useSelector((state) => state.user);
    const [showNotifiMobileNav, setShowNotifiMobileNav] = useState(false);
    const pageSize = 5;
    const name = user.fullname;
    const latestChat = useRef(null);
    latestChat.current = notifications;

    // Handle Logout
    const [fetchData] = useLazyFetch(`https://localhost:5001/api/auth/logout`, {
        method: "POST",
        body: {}
    });

    const handleLogout = () => {
        fetchData();
        history.push({
            pathname: "/logout",
            state: {
                logout: "logout"
            }
        });
    };

    // Get Notifications
    const [fetchNotifi] = useLazyFetch(
        `${API}/Notify/history?email=${user?.email.toLowerCase()}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
            method: "get",
            onCompletes: (data) =>{
                setNotifications(notifications.concat(data.payload));
            }
        }
    );

    useEffect(() => {
  
        if (user?.role.toLowerCase() === "student") {
            fetchNotifi();
        }
    }, [pageNumber]);

    // Connect to SignalR Server
    useEffect(() => {
        if (user?.role.toLowerCase() == "student") {
            const newConnection = new HubConnectionBuilder()
                .withUrl("https://localhost:5001/hubs/notification")
                .withAutomaticReconnect()
                .build();

            setConnection(newConnection);
        }
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    // Define User
                    connection.send(
                        "CreateName",
                        `${user?.email.toLowerCase()}`
                    );

                    // Get Notifications are sended in Real Time
                    connection.on("ReceiveNotification", (message) => {
                        console.log("test");
                        const updatedChat = [...latestChat.current];
                        updatedChat.unshift(message);
                        setNotifications(updatedChat);
                    });
                })
                .catch((error) => console.log(error));
        }
    }, [connection]);

    // Handle Infinite scroll
    const handleScroll = (e) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop ===
            e.target.clientHeight;
        if (bottom) {
            setPageNumber(pageNumber + 1);
        }
    };

    // Handle Seen Notifications
    const [fetchSeen] = useLazyFetch(`${API}/Notify/setSeen`, {
        method: "POST",
        body: user?.email.toLowerCase(),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const handleSeen = () => {
        if (
            notifications?.filter(
                (notification) => notification.isSeen === false
            ).length !== 0
        ) {
            fetchSeen();
            setNotifications(
                notifications.map((notification) => {
                    if (notification.isSeen === false) {
                        return {
                            user: notification.user,
                            sendTo: notification.sendTo,
                            message: notification.message,
                            createdAt: notification.createdAt,
                            isSeen: true
                        };
                    } else {
                        return notification;
                    }
                })
            );
        }
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

                    {/* Notification Navbar */}
                    {user?.role.toLowerCase() == "student" ? (
                        <div className={styles.showNotifi}>
                            {/* Notification Icon */}
                            <div
                                className="text-Color btn rounded-circle text-center justify-content-center align-items-center position-relative"
                                style={{ width: 40, height: 40 }}
                                onTouchStart={() => {
                                    setShowNotifiMobileNav(
                                        !showNotifiMobileNav
                                    );
                                    handleSeen();
                                }}
                                onMouseOver={handleSeen}
                            >
                                <Icon
                                    className={
                                        showNotifiMobileNav
                                            ? "iconClick-Color"
                                            : "icon-Color "
                                    }
                                    icon="bell"
                                    style={{ fontSize: "1.5rem" }}
                                />
                                <span
                                    className="position-absolute start-100 translate-middle badge rounded-pill bg-danger"
                                    style={{ top: "15%" }}
                                >
                                    {notifications?.filter(
                                        (notification) =>
                                            notification.isSeen === false
                                    ).length !== 0
                                        ? notifications.filter(
                                              (notification) =>
                                                  notification.isSeen === false
                                          ).length
                                        : ""}
                                </span>
                            </div>
                            {/* Notification Menu */}
                            <div
                                className={
                                    showNotifiMobileNav
                                        ? `${styles.frameMobile_Notifi} d-flex justify-content-end position-absolute`
                                        : `${styles.frame_Notifi} d-flex justify-content-end position-absolute`
                                }
                            >
                                <div
                                    className={
                                        showNotifiMobileNav
                                            ? `shadow-app ${styles.bodyMobile_Notifi} p-2`
                                            : `shadow ${styles.body_Notifi} p-2`
                                    }
                                >
                                    {/* Notification Header */}
                                    <div
                                        className="text-Color row mx-0 py-1"
                                        style={{ fontSize: "24px" }}
                                    >
                                        <b>Notifications</b>
                                    </div>
                                    <div className="text-Color px-3">
                                        <hr className="my-1" />
                                    </div>
                                    {/* Notifications */}
                                    <div
                                        className={styles.scroll_Notifi}
                                        onScroll={handleScroll}
                                    >
                                        {notifications.length > 0 ? (
                                            notifications?.map(
                                                (notification, objIndex) => (
                                                    <div
                                                        className={
                                                            styles.notifi_list
                                                        }
                                                        key={objIndex + "a"}
                                                    >
                                                        <div className="text-Color navbarSelect-Color row mx-0 p-2">
                                                            {/* Icon */}
                                                            <div
                                                                className="shadow-app col-4 rounded-circle d-flex align-items-center px-0 ps-2"
                                                                style={{
                                                                    width: "2.5rem",
                                                                    height: "2.5rem"
                                                                }}
                                                            >
                                                                <Icon
                                                                    icon="chalkboard-teacher"
                                                                    size="lg"
                                                                />
                                                            </div>
                                                            {/* Sender */}
                                                            <div className="col-8 text-start">
                                                                <div>
                                                                    <b>
                                                                        {
                                                                            notification.user
                                                                        }
                                                                    </b>
                                                                </div>
                                                                {/* Message */}
                                                                <div className="text-break">
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </div>
                                                                {/* Time Send */}
                                                                <div
                                                                    style={{
                                                                        fontSize:
                                                                            "12px"
                                                                    }}
                                                                >
                                                                    {moment(
                                                                        notification.createdAt
                                                                    ).fromNow()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-Color px-4">
                                                            <hr className="my-1" />
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="text-Color text-center">
                                                No Notification
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
               
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
          
            {/* </div> */}
        </nav>
    );
};

export default HorizontalNavBar;
