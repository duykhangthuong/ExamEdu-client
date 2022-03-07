import Button from "components/Button";
import Heading from "components/Heading";
import Icon from "components/Icon";
import Pagination from "components/Pagination";
import SearchBar from "components/SearchBar";
import Wrapper from "components/Wrapper";
import moment from "moment";
import Loading from "pages/Loading";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { API } from "utilities/constants";
import { useFetch, useLazyFetch } from "utilities/useFetch";
import styles from "../../styles/ExamList.module.css";

const ExamList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    //Get parameters from history
    const param = useParams();
    const history = useHistory();

    //Fetch classModule info
    const { data, loading, error } = useFetch(
        `${API}/ClassModule/${param.classModuleId}`
    );
    //Fetching exams
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/Exam/progressExam/${param.classModuleId}?pageNumber=${currentPage}&pageSize=${pageSize}`
    );
    console.log(fetchResult);

    function onAddButtonClick() {
        history.push("/teacher/exam/create/info");
    }

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    if (fetchResult.loading || loading) return <Loading />;

    return (
        <Wrapper>
            <SearchBar
                pageName={"Exam List"}
                onAddButtonClick={onAddButtonClick}
            />
            {/* Class name */}
            <div style={{ color: "var(--color-dark-blue)" }}>
                <Icon icon="id-card" className="me-2" />
                {data.class.className}
            </div>
            {/* Module code and name */}
            <div className="mb-2" style={{ color: "var(--color-dark-blue)" }}>
                <Icon icon="cube" className="me-2" />
                {`${data.module.moduleCode} - ${data.module.moduleName}`}
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
                            examId={exam.examId}
                            moduleId={data.module.moduleId}
                            examName={exam.examName}
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

const ExamCard = ({
    date,
    duration,
    isCancelled,
    examId,
    moduleId,
    classModuleId,
    examName
}) => {
    const history = useHistory();
    function onClickViewDetail(examId, classModuleId) {
        history.push(`/teacher/exam/list/result/${examId}/${classModuleId}`);
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
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <Heading size="3" className="mb-3">
                        {examName}
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
                <Button
                    onClick={() => onClickViewDetail(examId, classModuleId)}
                >
                    View Detail <Icon icon="arrow-right" className="ms-2" />
                </Button>
            </article>
        </div>
    );
};
