import React from "react";
import styles from "../styles/Wrapper.module.css";

const Wrapper = ({ children, className = "", style = {} }) => {
    return (
        <div
            style={{
                ...style,
                width: "100vw",
                height: "88vh", //Changed minHeight to maxHeight to fix the issue of the page not being scrollable.
            }}
            className={`${styles.main} ${className} overflow-auto`} //Added overflow-auto to fix the issue of the page not being scrollable.
        >
            {children}
        </div>
    );
};

export default Wrapper;
