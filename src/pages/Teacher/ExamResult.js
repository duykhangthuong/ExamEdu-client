import SearchBar from "components/SearchBar";
import Wrapper from "components/Wrapper";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { API } from "utilities/constants";
import { useParams } from "react-router-dom";
import { useLazyFetch, useFetch } from "utilities/useFetch";
import { useWindowSize } from "utilities/useWindowSize";
import Icon from "components/Icon";
import styles from "styles/ExamResult.module.css";
import Table from "components/Table";
import moment from "moment";
import Button from "components/Button";
import Loading from "pages/Loading";
import Heading from "components/Heading";
const ExamResult = () => {
    const size = useWindowSize();
    const param = useParams();
    const history = useHistory();
    const columns = [
        "ID",
        "Full name",
        "Time Spent",
        "Submitted time",
        "Result",
        size.width > 768 ? "Grade" : "",
    ];

    const [studentId, setStudentId] = useState();
    const [searchName, setSearchName] = useState("");
    const [currentPage, setcurrentPage] = useState(1);
    const pageSize = 5;

    //Fetch API for the table of the exam result
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/exam/result/${param.ExamID}?pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`
    );

    //Fetch classModule info
    // const { data, loading, error } = useFetch(
    //     `${API}/ClassModule/${param.classModuleId}`,
    //     {
    //         onCompletes: (data) => {},
    //         onError: (error) => {},
    //     }
    // );

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    //Check if the page is loaded and if there is any data record
    if (fetchResult.loading) return <Loading />;
    if (fetchResult.error?.status === 404) {
        return (
            <Wrapper className="d-flex justify-content-center align-items-center">
                <div className={styles.notification_box}>
                    <Heading size="3">This exam has no result yet!!!</Heading>
                </div>
            </Wrapper>
        );
    }

    //Main HTML content
    return (
        <Wrapper>
            <SearchBar
                pageName={"Exam Result"}
                onAddButtonClick={() => {
                    history.push("/teacher/exam/create/info");
                }}
            />
            <div className="d-flex flex-md-row">
                <div className="d-flex flex-md-column me-5">
                    {/* Class name */}
                    <div
                        className="mb-2"
                        style={{ color: "var(--color-dark-blue)" }}
                    >
                        <Icon icon="id-card" className="me-2" />
                        {"chờ Minh pass param"}
                    </div>
                    {/* Module code and name */}
                    <div
                        className="mb-2"
                        style={{ color: "var(--color-dark-blue)" }}
                    >
                        <Icon icon="cube" className="me-2" />
                        {`${"chờ Minh pass param"}`}
                    </div>
                </div>
                <div className="d-flex flex-md-column">
                    {/* Exam name */}
                    <div
                        className="mb-2"
                        style={{ color: "var(--color-dark-blue)" }}
                    >
                        <Icon icon="clipboard-list" className="me-2" />
                        {`${fetchResult.data?.payload[0].examName}`}
                    </div>
                    {/* Exam time */}
                    <div
                        className="mb-2"
                        style={{ color: "var(--color-dark-blue)" }}
                    >
                        <Icon icon="calendar" className="me-2" />
                        {`${moment(fetchResult.data?.payload[0].examDay).format(
                            "DD/MM/YYYY, h:mm A"
                        )}`}
                    </div>
                </div>
            </div>

            {/* Horizontal line */}
            <div className={`${styles.horizontal_line} mb-2 mb-md-3`}></div>

            <Table
                columns={columns}
                data={fetchResult.data?.payload.map((item) => ({
                    id: item.studentId,
                    fullName: item.studentName,
                    timeSpent:
                        moment(item.finishedAt).diff(item.examDay, "minutes") +
                        " minutes",
                    submittedTime: moment(item.finishedAt).format(
                        "DD/MM/YYYY, h:mm A"
                    ),
                    result: (
                        <div
                            className={
                                item.mark >= 5
                                    ? styles["markPillPassed"]
                                    : styles["markPillNotPassed"]
                            }
                        >
                            {Number.isInteger(item.mark)
                                ? item.mark + ".0"
                                : item.mark}
                        </div>
                    ),
                    grade: (
                        //Nút chấm điểm tự luận, onClick sẽ trả về studentId vào State ở dòng 31
                        <div
                            className="d-flex justify-content-center"
                            onClick={() => {
                                setStudentId(item.studentId);
                            }}
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Grade Text Question"
                        >
                            <Button
                                circle={true}
                                disabled={
                                    fetchResult.loading ||
                                    !item.needToGradeTextQuestion
                                }
                            >
                                <Icon
                                    icon="pencil-ruler"
                                    color="#fff"
                                    className="fs-4"
                                />
                            </Button>
                        </div>
                    ),
                }))}
            />
        </Wrapper>
    );
};

export default ExamResult;
