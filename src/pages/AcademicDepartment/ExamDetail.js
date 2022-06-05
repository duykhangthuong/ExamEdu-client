import Button from "components/Button";
import Icon from "components/Icon";
import Table from "components/Table";
import Wrapper from "components/Wrapper";
import React from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLazyFetch } from "utilities/useFetch";
import styles from "../../styles/ExamDetail.module.css";
import { API } from "utilities/constants";
import Swal from "sweetalert2";
import Loading from "pages/Loading";
const ExamDetail = () => {
    const column = ["Student ID", "Student Name", "Email", "Mark"];

    const param = useParams();
    const history = useHistory();
    const data = [
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        },
        {
            "Student ID": "1",
            "Student Name": "Nguyễn Văn A",
            Email: "etst@gmail.com",
            Mark: "10"
        }
    ];
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
                            <p>SE1501</p>
                            <p>24-2-2022</p>
                            <p>24-2-2022</p>
                            <p>24-2-2022</p>
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
                        </div>
                        <div className={styles.column2}>
                            <p>SE1501</p>
                            <p>24-2-2022</p>
                            <p>24-2-2022</p>
                            <Status>DONE</Status>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-end w-100">
                    <div className={`${styles.basicDiv} me-auto`}>
                        <h5>PROCTOR & SUPERVISOR</h5>
                        <hr />
                        <div className={styles.content}>
                            <div className={styles.column1}>
                                <p className="mb-0">Luong Hoang Huong</p>
                                <p className="mb-0">huonghl@fpt.edu.vn</p>
                            </div>
                            <div className={styles.verticalLine}></div>
                            <div className={styles.column2}>
                                <p className="mb-0">Luong Hoang Huong</p>
                                <p className="mb-0">huonghl@fpt.edu.vn</p>
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
                <div className={styles.tableDiv}>
                    <Table columns={column} data={data} />
                </div>
            </div>
            <div className={styles.questionDiv}>
                <h5>QUESTIONS</h5>
                <hr />
                <div className={styles.questionList}>
                    <Question />
                    <Question />
                    <Question />
                    <Question />
                    <Question />
                    <Question />
                    <Question />
                    <Question />
                    <Question />
                </div>
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

const Question = () => {
    return (
        <div className={styles.question}>
            <p className="m-2 me-3 fw-bold fs-5 ">LV1</p>
            <div>
                <p className="mb-1 fw-bold">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris eu nunc nec neque lobortis rutrum eu fermentum
                    tellus. Orci varius natoque penatibus et magnis dis
                    parturient montes, nascetur ridiculus mus.
                </p>

                <div className="d-flex">
                    <p className="me-5 mb-1">A. Dap an Aasdsa</p>
                    <p className="mb-1">B. Dap an B</p>
                </div>
                <div className="d-flex">
                    <p className="me-5 mb-1">C. Dap anssss </p>
                    <p className="mb-1">D.sa</p>
                </div>
            </div>
        </div>
    );
};
