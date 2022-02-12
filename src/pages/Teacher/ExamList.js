import Button from "components/Button";
import Heading from "components/Heading";
import Icon from "components/Icon";
import Pagination from "components/Pagination";
import SearchBar from "components/SearchBar";
import Wrapper from "components/Wrapper";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { API } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import styles from "../../styles/ExamList.module.css";

const ExamList = () => {
    function onAddButtonClick() {}
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    //Fetching exams
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/Exam/progressExam/1?pageNumber=${currentPage}&pageSize=${pageSize}`
    );

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    if (fetchResult.loading) return <Wrapper>Loading...</Wrapper>;

    return (
        <Wrapper>
            <SearchBar
                pageName={"Exam List"}
                onAddButtonClick={onAddButtonClick}
            />
            {/* Class name */}
            <div style={{ color: "var(--color-dark-blue)" }}>
                <Icon icon="id-card" className="me-2" />
                SE1501
            </div>
            {/* Module code and name */}
            <div className="mb-2" style={{ color: "var(--color-dark-blue)" }}>
                <Icon icon="cube" className="me-2" />
                PRM192 - Mobile Programming
            </div>
            {/* Horizontal line */}
            <div className={`${styles.horizontal_line} mb-2 mb-md-3`}></div>

            {/* Progress tests container */}
            <section className={styles.exam_card_container}>
                {/* Progress test card */}
                {fetchResult.data?.payload.map((exam) => {
                    return (
                        <ExamCard
                            date={exam.examDay}
                            duration={exam.durationInMinute}
                            isCancelled={exam.isCancelled}
                            key={exam.examId}
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
        </Wrapper>
    );
};

export default ExamList;

const ExamCard = ({ date, duration, isCancelled }) => {
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
                <div>
                    <Heading size="3" className="mb-3">
                        Progress Test
                    </Heading>
                    {/* Date time */}
                    <div className="mb-3">
                        <Icon icon="calendar-alt" className="me-2" />
                        {moment(date).format("DD/MM/yyyy")}
                    </div>
                    {/* Duration */}
                    <div className="mb-3">
                        <Icon icon="forward" className="me-2" />
                        {`${duration} minutes`}
                    </div>
                </div>
                {/* Button */}
                <Button>
                    View Detail <Icon icon="arrow-right" className="ms-2" />
                </Button>
            </article>
        </div>
    );
};
