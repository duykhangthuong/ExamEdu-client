import React from "react";

const Heading = ({ size = 1, children, className = "", style = {} }) => {
    return (
        <div className={`h${size} ${className} txt-dark-blue`} style={style}>
            <b>{children}</b>
        </div>
    );
};
export default Heading;
