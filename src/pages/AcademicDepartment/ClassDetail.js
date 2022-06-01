import Button from "components/Button";
import Heading from "components/Heading";
import Icon from "components/Icon";
import Wrapper from "components/Wrapper";
import React from "react";
import styles from "../../styles/ClassDetail.module.css";
import { useLazyFetch } from "utilities/useFetch";
import { useEffect } from "react";
import { API } from "utilities/constants";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useHistory } from "react-router-dom";
const ClassDetail = () => {
    //Get parameters from history
    const param = useParams();
    const history = useHistory();

    const [fetchData, fetchDataResult] = useLazyFetch(
        `${API}/class/${param.classId}`
    );
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <Wrapper>
            <Heading>Class Detail</Heading>
            <div className="d-flex ">
                <div className={styles.basicDiv}>
                    <h5 className="ms-3">BASIC INFORMATION</h5>
                    <hr />
                    <div className={styles.content}>
                        <div className={styles.column1}>
                            <p>Class Name</p>
                            <p>Start Date</p>
                            <p>End Date</p>
                            <p>Creation Date</p>
                        </div>
                        <div className={styles.column2}>
                            <p>{fetchDataResult.data?.className}</p>
                            <p>
                                {moment(fetchDataResult.data?.startDay).format(
                                    "DD/MM/YYYY"
                                )}
                            </p>
                            <p>
                                {moment(fetchDataResult.data?.endDay).format(
                                    "DD/MM/YYYY"
                                )}
                            </p>
                            <p>
                                {moment(fetchDataResult.data?.createdAt).format(
                                    "H:MM A DD/MM/YYYY"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <Button className="ms-3 align-self-end" onClick={() => {}}>
                    <Icon icon="pen" className="me-2" />
                    <p className="mb-0 text-start">
                        Update <br />
                        Information
                    </p>
                </Button>
            </div>
            <div className={styles.moduleDiv}>
                <h4>MODULE IN THIS CLASS</h4>
                <div className={styles.moduleContainer}>
                    {fetchDataResult.data?.classModules.map((module, index) => (
                        <Module
                            key={index}
                            codeModule={module.moduleCode}
                            nameModule={module.moduleName}
                            teacherName={module.teacherName}
                            onClick={() => {
                                history.push(
                                    `/class/classModule/${module.classModuleId}`
                                );
                            }}
                        />
                    ))}
                </div>
            </div>
        </Wrapper>
    );
};

export default ClassDetail;

const Module = ({ codeModule, nameModule, teacherName, onClick }) => {
    return (
        <div className={styles.moduleWrap}>
            <h3>{codeModule}</h3>
            <p className={styles.description}>{nameModule}</p>

            <p className="d-inline flex-grow-1">
                <Icon
                    icon="user-tie"
                    className="me-1"
                    color="var(--color-dark-blue)"
                />
                {teacherName}
            </p>
            <Button className="m-auto mt-auto" onClick={onClick}>
                <Icon icon="pen" className="me-2" />
                Update
            </Button>
        </div>
    );
};
