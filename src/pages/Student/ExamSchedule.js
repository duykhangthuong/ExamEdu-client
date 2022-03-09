import Heading from "components/Heading";
import Icon from "components/Icon";
import Wrapper from "components/Wrapper";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { API } from "utilities/constants";
import { useFetch } from "utilities/useFetch";
import { useHistory } from "react-router-dom";

//Styles
import styles from "../../styles/ExamSchedule.module.css";
import Swal from "sweetalert2";
import Loading from "pages/Loading";

const ExamSchedule = () => {
    const user = useSelector((store) => store.user);
    const { data, loading, error } = useFetch(`${API}/Exam/${user.accountId}`);

    if (loading) {
        return <Loading />;
    }
    if (error?.status === 404) {
        return (
            <Wrapper className="d-flex justify-content-center align-items-center">
                <div className={styles.notification_box}>
                    <Heading size="3">
                        You don't have any exam scheduled
                    </Heading>
                </div>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            {/* Date */}
            <div className="txt-blue">
                {moment(moment().toDate()).format("dddd, D MMMM yyyy")}
            </div>
            {/* Title */}
            <Heading className="txt-blue">Your upcoming exam</Heading>
            {/* Schedule container */}
            <div className="mb-5" style={{ maxheight: "70%" }}>
                {data?.payload.map((data, index) => {
                    return (
                        <Schedule
                            date={moment(data.examDay).format("DD MMMM")}
                            time={data.examDay}
                            name={data.examName}
                            desc={data.description}
                            subjectName={data.moduleCode}
                            alottedTime={data.durationInMinute}
                            examId={data.examId}
                            password={data.password}
                            key={index}
                        />
                    );
                })}
            </div>
        </Wrapper>
    );
};
export default ExamSchedule;

const Schedule = ({
    date,
    time,
    name,
    desc,
    subjectName,
    alottedTime,
    examId,
    password
}) => {
    const history = useHistory();
    function handleInputExamPassword(password) {
        //If there is a password, pop up the dialog box to enter password else go straight to exam
        if (!!password) {
            Swal.fire({
                title: "Enter exam password",
                input: "password",
                confirmButtonText: "Start Exam"
            }).then((result) => {
                //If Start Exam button is clicked then check if password is correct
                if (result.isConfirmed) {
                    if (result.value === password) {
                        history.push(`/student/exam/${examId}`);
                    } else {
                        Swal.fire("Wrong password", "", "error");
                    }
                }
            });
        } else {
            history.push(`/student/exam/${examId}`);
        }
    }
    function handleStartExam() {
        //if exam day is today and current time is between exam time and exam time + allotted time then start exam
        if (
            moment(time).isSame(moment().toDate(), "day") &&
            moment().isBetween(
                moment(time),
                moment(time).add(alottedTime, "minutes")
            )
        ) {
            handleInputExamPassword(password);
        } else {
            Swal.fire("Exam not started yet", "", "info");
        }
    }
    return (
        <>
            {/* Schedule container */}
            <div className="mb-4">
                {/* Test Date */}
                <p className="txt-blue mb-0">{date}</p>
                {/* Test information */}
                <div
                    className={`d-flex align-items-center justify-content-between txt-blue shadow-center-medium b-radius-8 overflow-hidden ${styles.schedule_container}`}
                >
                    {/* Bell and time container*/}

                    <div className={`${styles.container_bell_time}`}>
                        <Icon icon="bell"></Icon>
                        <p className="mb-0">{moment(time).format("hh:mm")}</p>
                    </div>

                    {/* Bigger container */}
                    <div className={styles.schedule_container_sub}>
                        {/* Test name and description container*/}
                        <div className={styles.container_testname}>
                            {/* Test name */}
                            <div>{name}</div>
                            {/* Test description */}
                            <p className="mb-0 mt-2">{desc}</p>
                        </div>
                        {/* Vertical separation line */}
                        <div className={styles.line}></div>
                        {/* Module name, allotted time container */}
                        <div className={styles.modulename_container}>
                            <Heading
                                size="3"
                                style={{ color: "var(--color-blue)" }}
                            >
                                {subjectName}
                            </Heading>
                            <div className={styles.alotted_time}>
                                {alottedTime} minutes
                            </div>
                        </div>
                        {/* Start button container */}
                        {/* Display start button only if exam date is in the future.
                        If not, display ended */}
                        {moment(time).isAfter(moment()) ? (
                            <div>
                                <button
                                    className={`shadow-light ${styles.btn_start} ${styles.btn_notyet}`}
                                    disabled
                                >
                                    Not yet
                                </button>
                            </div>
                        ) : moment().isBetween(
                              moment(time),
                              moment(time).add(alottedTime, "minutes")
                          ) ? (
                            <div>
                                <button
                                    className={`shadow-light ${styles.btn_start}`}
                                    onClick={() => {
                                        handleStartExam();
                                    }}
                                >
                                    <Icon icon="play" className="me-2"></Icon>
                                    Start
                                </button>
                            </div>
                        ) : (
                            <div>
                                <button
                                    className={`shadow-light ${styles.btn_end}`}
                                    disabled
                                >
                                    Ended
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
