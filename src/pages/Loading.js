import Wrapper from "components/Wrapper";
import React from "react";
import "styles/Loading.css";
const Loading = () => {
    return (
        <Wrapper className="d-flex justtify-content-center align-items-center">
            <div class="loader"></div>;
        </Wrapper>
    );
};
export default Loading;
