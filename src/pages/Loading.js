import Wrapper from "components/Wrapper";
import React from "react";
import "styles/Loading.css";
const Loading = ({ className, style = {} }) => {
    return (
        <Wrapper
            className={`d-flex justtify-content-center align-items-center ${className}`}
            style={style}
        >
            <div className="loader"></div>;
        </Wrapper>
    );
};
export default Loading;
