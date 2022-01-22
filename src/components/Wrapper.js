import React from "react";
import styles from "../styles/Wrapper.module.css";

const Wrapper = ({ children, className = "", style = {} }) => {
    return (
        <div
            style={{
                ...style,
                width: "100vw",
                minHeight: "100vh",
            }}
            className={`${styles.main} ${className}`}
        >
            {children}
        </div>
    );
};

export default Wrapper;
