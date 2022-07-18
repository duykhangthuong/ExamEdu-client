import Button from "components/Button";
import Heading from "components/Heading";
import Icon from "components/Icon";
import Pagination from "components/Pagination";
import SearchBar from "components/SearchBar";
import Wrapper from "components/Wrapper";
import moment from "moment";
import Loading from "pages/Loading";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { API } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import styles from "../../styles/ExamProctorList.module.css";

const ExamProctorList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    //Get parameters from history
    const param = useParams();
    const history = useHistory();

    const teacherId = useSelector((state) => state.user.accountId);
    //Fetching exams
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/Exam/examProctor/${teacherId}?pageNumber=${currentPage}&pageSize=${pageSize}`
    );

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    if (fetchResult.loading) return <Loading />;

    return (
        <Wrapper>
            <SearchBar pageName={"Exam Proctor List"} />

            {/* Horizontal line */}
            <div className={`${styles.horizontal_line} mb-2 mb-md-3`}></div>

            {fetchResult.error?.status === 404 ? (
                <div className="d-flex justify-content-center">
                    <Heading size={2}>There are no exams yet</Heading>
                </div>
            ) : (
                <>
                    {/* Progress tests container */}
                    <section className={styles.exam_card_container}>
                        {/* Progress test card */}
                        {fetchResult.data?.payload.map((exam) => {
                            return (
                                <ExamCard
                                    examId={exam.examId}
                                    examName={exam.examName}
                                    moduleCode={exam.moduleCode}
                                    description={exam.description}
                                    room={exam.room}
                                    password={exam.password}
                                    date={exam.examDay}
                                    duration={exam.durationInMinute}
                                    isFinalExam={exam.isFinalExam}
                                    isCancelled={exam.isCancelled}
                                    supervisorEmail={exam.supervisorEmail}
                                />
                            );
                        })}
                    </section>
                    <Pagination
                        totalRecords={fetchResult.data?.totalRecords}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                    />
                </>
            )}
        </Wrapper>
    );
};

export default ExamProctorList;

const ExamCard = ({
    examId,
    examName,
    moduleCode,
    description,
    room,
    password,
    date,
    duration,
    isFinalExam,
    isCancelled,
    supervisorEmail
}) => {
    const history = useHistory();

    function onClickInvigilate(examId) {
        history.push(`/invigilate/${examId}`);
    }

    return (
        <div className={styles.exam_card_wrapper}>
            <article className={styles.exam_card}>
                {/* Check icon */}
                {isCancelled ? (
                    <Icon
                        icon="times-circle"
                        className={styles.times_icon}
                        styles={{ color: "var(--color-orange)" }}
                    />
                ) : moment(date).isAfter(moment().toDate()) ? (
                    <Icon icon="clock" className={styles.clock_icon} />
                ) : (
                    <Icon icon="check-circle" className={styles.check_icon} />
                )}

                {/* Progress test */}
                <div className="d-flex flex-column justify-content-center align-items-center text-center">
                    <Heading size="3" className="mb-3">
                        {examName}
                    </Heading>
                    {/* Module code */}
                    <div className="mb-3">
                        <Icon icon="cube" className="me-2"  aria-hidden="true" title="Exam module"/>
                        {moduleCode}
                    </div>
                    {/* Date time */}
                    <div className="mb-3">
                        <Icon icon="calendar-alt" className="me-2" aria-hidden="true" title="Exam date" />
                        {moment(date).format("DD/MM/yyyy")}
                    </div>
                    {/* Duration */}
                    <div className="mb-3">
                        <Icon icon="forward" className="me-2" aria-hidden="true" title="Duration" />
                        {`${duration} minutes`}
                    </div>
                    {/* Room */}
                    <div className="mb-3">
                        <Icon icon="users" className="me-2" aria-hidden="true" title="Room"/>
                        {room}
                    </div>
                    {/* Password */}
                    <div className="mb-3">
                        <Icon icon="key" className="me-2" aria-hidden="true" title="Password" />
                        {password ? password : "No password"}
                    </div>
                    {/* Supervisor */}
                    <div className="mb-3">
                        <Icon icon="address-card" className="me-2" aria-hidden="true" title="Supervisor contact" />
                        {supervisorEmail}
                    </div>
                    {/* Description */}
                    <div className="mb-3">
                        <Icon icon="pen" className="me-2"  aria-hidden="true" title="Description"/>
                        {description ? description : "No description"}
                    </div>
                </div>
                {/* Buttons */}
                <div className={styles.btn_container}>
                    <Button
                        onClick={() => {
                            onClickInvigilate(examId);
                        }}
                        className="mr-2"
                        style={{ backgroundColor: "#8b0000" }}
                        {...(isCancelled && { disabled: true })}
                        {...(moment(date).isAfter(moment().toDate()) && {
                            disabled: true
                        })}
                    >
                        Start <Icon icon="arrow-right" className="ms-2" />
                    </Button>
                </div>
            </article>
        </div>
    );
};
