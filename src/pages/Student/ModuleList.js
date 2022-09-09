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
    const { data, loading } = useFetch(`${API}/Module/${user}`);
    function onClickMarkReport(moduleId) {
        history.push(`/student/mark/report/${moduleId}`);
    }
    if (loading) {
        return <Loading />;
    }
    return (
        <Wrapper>
            <Heading size="1">Your Module</Heading>
            <div className="d-flex justify-content-center flex-wrap">
                {data?.payload.map((module, index) => (
                    <div
                        className={`${style.frame} d-flex flex-column justify-content-between p-3 mb-3 `}
                        key={index}
                    >
                        <div>
                            <h3 className="fw-bold">{module.moduleCode}</h3>
                        </div>
                        <div>
                            <div className="d-flex">
                                <Icon
                                    icon="folder"
                                    color="#3b5af1"
                                    className="me-3"
                                />
                                <p>{module.moduleName}</p>
                            </div>
                            <div className="d-flex">
                                <Icon
                                    icon="user"
                                    color="#3b5af1"
                                    className="me-3"
                                />
                                <p>{module.teacherEmail}</p>
                            </div>
                        </div>
                        <Button
                            className="py-2"
                            onClick={() => onClickMarkReport(module.moduleId)}
                        >
                            View examinations result
                            <Icon icon="arrow-right" className="ms-2" />
                        </Button>
                    </div>
                ))}
            </div>
        </Wrapper>
    );
};

export default ModuleList;
