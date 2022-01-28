import React from "react";
import Icon from "./Icon";

const ValidateMessage = ({ message, className = "", style }) => {
    return (
        <div
            className={`alert alert-danger py-1 px-2 shadow-light ${className}`}
            style={{ fontSize: 13, ...style }}
        >
            <Icon icon="exclamation-triangle" className="me-2" />
            <span>{message}</span>
        </div>
    );
};

export default ValidateMessage;
