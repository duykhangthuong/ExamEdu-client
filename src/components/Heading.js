import React from "react";

const Heading = ({ size = 1, children, className = "", style = {} }) => {
    return (
        <div className={`h${size} ${className}`} style={style}>
            <b>{children}</b>
        </div>
    );
};
export default Heading;
