import Button from "components/Button";
import Icon from "components/Icon";
import Table from "components/Table";
import Wrapper from "components/Wrapper";
import React from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLazyFetch, useFetch } from "utilities/useFetch";
import styles from "../../styles/ExamDetail.module.css";
import { API } from "utilities/constants";
import Swal from "sweetalert2";
import Loading from "pages/Loading";
import { useEffect, useState } from "react";
import moment from "moment";
const ExamDetail = () => {
    const column = ["Student ID", "Student Name", "Email", "Mark"];

    const param = useParams();
    const history = useHistory();
    //Fetch data exam question
    const fetchDataExamInforResult = useFetch(
        `${API}/Exam/examDetail/${param.examId}`,
        {
            onError: (err) => {
                Swal.fire({
                    title: "Error",
                    text: err.message,
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        }
    );

    //Fetch data exam question
    const fetchDataExamStudentResult = useFetch(
        `${API}/Exam/result/${param.examId}`,
        {
            // onError: (err) => {
            //     Swal.fire({
            //         title: "Error",
            //         text: err.message,
            //         icon: "error",
            //         confirmButtonText: "OK"
            //     });
            // }
        }
    );

    //Fetch data exam question
    const fetchDataExamQuestionResult = useFetch(
        `${API}/ExamQuestions/ExamDetail/${param.examId}`,
        {
            onError: (err) => {
                Swal.fire({
                    title: "Error",
                    text: err.message,
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        }
    );

    //Fetch cancel exam
    const [fetchDataCancel, { loading }] = useLazyFetch(
        `${API}/exam/cancel/${param.examId}`,
        {
            method: "PUT",
            onCompletes: (res) => {
                if (res.status === 200) {
                    Swal.fire({
                        title: "Cancelled",
                        text: "Cancelled successfully",
                        icon: "success",
                        confirmButtonText: "OK"
                    });
                    //fetch lại hàm exam detail
                    //fetchDataExaMDetail();
                }
            },
            onError: (err) => {
                Swal.fire({
                    title: "Error",
                    text: err.message,
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        }
    );
    console.log(
        moment(fetchDataExamInforResult.data?.examDay).isAfter(moment())
    );
    if (loading) return <Loading />;
    return (
        <Wrapper>
            <div className="d-flex justify-content-between flex-wrap">
                <div className={styles.basicDiv}>
                    <h5>BASIC INFORMATION</h5>
                    <hr />
                    <div className={styles.content}>
                        <div className={styles.column1}>
                            <p>Exam Name</p>
                            <p>Module</p>
                            <p>Description</p>
                            <p>Password</p>
                        </div>
                        <div className={styles.column2}>
                            <p>{fetchDataExamInforResult.data?.examName}</p>
                            <p>{fetchDataExamInforResult.data?.moduleName}</p>
                            <p>
                                {fetchDataExamInforResult.data?.description ===
                                ""
                                    ? "No description"
                                    : fetchDataExamInforResult.data
                                          ?.description}
                            </p>
                            <p>{fetchDataExamInforResult.data?.password}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.basicDiv}>
                    <h5>TIME & PLACE</h5>
                    <hr />
                    <div className={styles.content}>
                        <div className={styles.column1}>
                            <p>Date</p>
                            <p>Duration</p>
                            <p>Room</p>
                            <p>Status</p>
                            <p>Exam type</p>
                        </div>
                        <div className={styles.column2}>
                            <p>
                                {moment(
                                    fetchDataExamInforResult.data?.examDay
                                ).format("HH:MM DD-MM-YYYY")}
                            </p>
                            <p>
                                {
                                    fetchDataExamInforResult.data
                                        ?.durationInMinute
                                }{" "}
                                minutes
                            </p>
                            <p>
                                {fetchDataExamInforResult.data?.room === ""
                                    ? "No Room"
                                    : fetchDataExamInforResult.data?.room}
                            </p>
                            <Status>
                                {moment(
                                    fetchDataExamInforResult.data?.examDay
                                ).isBefore(moment())
                                    ? "DONE"
                                    : fetchDataExamInforResult.data?.isCancelled
                                    ? "CANCELLED"
                                    : "NOT YET"}
                            </Status>
                            <p>
                                {fetchDataExamInforResult.data?.isFinalExam
                                    ? "Final Exam"
                                    : "Progress Test"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-end w-100">
                    <div className={`${styles.basicDiv} me-auto`}>
                        <h5>PROCTOR & SUPERVISOR</h5>
                        <hr />
                        <div className={styles.content}>
                            <div className={styles.column1}>
                                <p className="mb-0">
                                    {
                                        fetchDataExamInforResult.data
                                            ?.proctorFullName
                                    }
                                </p>
                                <p className="mb-0">
                                    {
                                        fetchDataExamInforResult.data
                                            ?.proctorEmail
                                    }
                                </p>
                            </div>
                            <div className={styles.verticalLine}></div>
                            <div className={styles.column2}>
                                <p className="mb-0">Super Visor</p>
                                <p className="mb-0">
                                    {
                                        fetchDataExamInforResult.data
                                            ?.supervisorEmail
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="me-3"
                        onClick={() => {
                            history.push(
                                `/AcademicDepartment/exam/update/info/${param.examId}`
                            );
                        }}
                    >
                        Update
                        <Icon
                            icon="pencil-ruler"
                            color="#fff"
                            className="ms-1"
                        />
                    </Button>
                    <Button
                        btn="secondary"
                        onClick={() => {
                            Swal.fire({
                                title: "Are you Sure",
                                text: "Press OK to continue",
                                icon: "question",
                                showCancelButton: true,
                                confirmButtonColor: "#3b5af1",
                                cancelButtonColor: "#e76565",
                                confirmButtonText: "OK"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    fetchDataCancel();
                                }
                            });
                        }}
                        disabled={
                            moment(
                                fetchDataExamInforResult.data?.examDay
                            ).isBefore(moment()) ||
                            fetchDataExamInforResult.data?.isCancelled
                        }
                    >
                        Cancel
                        <Icon
                            icon="times-circle"
                            color="#fff"
                            className="ms-1"
                        />
                    </Button>
                </div>
            </div>
            <div className={styles.studentListDiv}>
                <h5>STUDENT LIST</h5>
                <hr />
                {fetchDataExamStudentResult.loading ? (
                    <Loading className="w-100" />
                ) : (
                    <div className={styles.tableDiv}>
                        <Table
                            columns={column}
                            data={fetchDataExamStudentResult.data?.payload.map(
                                (item) => ({
                                    studentId: item.studentId,
                                    studentName: item.studentName,
                                    email: item.studentEmail,
                                    mark: (
                                        <div
                                            className={
                                                item.mark >= 5
                                                    ? styles["markPillPassed"]
                                                    : styles[
                                                          "markPillNotPassed"
                                                      ]
                                            }
                                        >
                                            {Number.isInteger(item.mark)
                                                ? item.mark + ".0"
                                                : item.mark}
                                        </div>
                                    )
                                })
                            )}
                        />
                    </div>
                )}
            </div>
            <div className={styles.questionDiv}>
                <h5>QUESTIONS</h5>
                <hr />
                {fetchDataExamQuestionResult.loading ? (
                    <Loading className="w-100" />
                ) : (
                    <div className={styles.questionList}>
                        {fetchDataExamQuestionResult.data?.map(
                            (item, index) => (
                                <Question
                                    level={item.levelName}
                                    question={item.questionContent}
                                    answers={item.answers}
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default ExamDetail;

const Status = ({ children }) => {
    if (children === "DONE") {
        return <p className={styles.Done}>{children}</p>;
    } else if (children === "NOT YET") {
        return <p className={styles.NotYet}>{children}</p>;
    } else if (children === "CANCELLED") {
        return <p className={styles.Cancel}>{children}</p>;
    } else return <p>{children}</p>;
};

const Question = ({ level, question, answers }) => {
    const alphabet = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
    ];
    return (
        <div className={styles.question}>
            <p className="m-2 me-3 fw-bold fs-5 ">
                {level === "Easy" ? "LV1" : level === "Medium" ? "LV2" : "LV3"}
            </p>
            <div>
                <p className="mb-1 fw-bold">{question}</p>
                {answers?.map((item, index) => (
                    <p
                        className="mb-1"
                        key={index}
                        style={item.isCorrect ? { fontWeight: "bold" } : {}}
                    >
                        {/* Check if the question is the text question */}
                        {answers.length === 1
                            ? "Require:"
                            : alphabet[index]}. {item.answerContent}
                    </p>
                ))}
            </div>
        </div>
    );
};
