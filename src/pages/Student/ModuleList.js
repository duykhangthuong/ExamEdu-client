import Button from "components/Button";
import Icon from "components/Icon";
import Wrapper from "components/Wrapper";
import React from "react";
import { useSelector } from "react-redux";
import style from "styles/ModuleListStudent.module.css";
import { API } from "utilities/constants";
import { useFetch } from "utilities/useFetch";
import Heading from "components/Heading";
import Loading from "pages/Loading";
import { useHistory } from "react-router-dom";

const ModuleList = () => {
    const user = useSelector((state) => state.user.accountId);
    const history = useHistory();
    const { data, loading, error } = useFetch(`${API}/Module/${user}`);
    function onClickMarkReport(moduleId) {
        history.push(`/student/mark/report/${moduleId}`);
    }
    if (loading) {
        return <Loading />;
    }
    return (
        <Wrapper>
            <Heading size="1">Your Module</Heading>
            <div className="d-flex flex-column flex-md-row">
                {data?.payload.map((module) => (
                    <div
                        className={`${style.frame} d-flex flex-column align-items-center p-3 `}
                    >
                        <Icon
                            icon="bookmark"
                            size="3x"
                            color="#3b5af1"
                            className="mb-3"
                        />
                        <h2 className="mb-3 fw-bold">{module.moduleCode}</h2>
                        <div className="justify-content-end">
                            <div className="mb-3">
                                <Icon icon="graduation-cap" className="me-3" />
                                {module.teacherEmail}
                            </div>
                            <div className="mb-3">
                                <Icon icon="graduation-cap" className="me-3" />
                                {module.moduleName}
                            </div>
                        </div>
                        <Button
                            className="py-2"
                            onClick={() => onClickMarkReport(module.moduleId)}
                        >
                            View mark list
                            <Icon icon="arrow-right" className="ms-2" />
                        </Button>
                    </div>
                ))}
            </div>
        </Wrapper>
    );
};

export default ModuleList;
