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
import { API } from "utilities/constants";
import { useFetch, useLazyFetch } from "utilities/useFetch";
import styles from "../../styles/ExamList.module.css";
import Swal from "sweetalert2";
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
        `${API}/Exam/progressExam/${param.classModuleId}/${param.moduleId}?pageNumber=${currentPage}&pageSize=${pageSize}`
    );
    // console.log(fetchResult);

    function onAddButtonClick() {
        history.push("/teacher/exam/create/info");
    }

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    //Fetch report data to download report file
    const [fetchReportData, fetchReportDataResult] = useLazyFetch(
        `${API}/exam/report/${param.classModuleId}/${param.moduleId}`,
        {
            method: "get",
            responseType: "blob",
            //Oncompleted -> download file
            onCompletes: (dataStream) => {
                const fileURL = URL.createObjectURL(dataStream);

                const anchor = document.createElement("a");
                anchor.href = fileURL;
                anchor.download = `ReportProgressExam_${data?.class.className}_${data?.module.moduleCode}`;
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);

                URL.revokeObjectURL(fileURL);
            },
            onError: (error) => {
                // Alert message if fail
                Swal.fire("Error!", error.message, "error");
            }
        }
    );
    if (fetchResult.loading || loading) return <Loading />;

    return (
        <Wrapper>
            <SearchBar
                pageName={"Exam List"}
                onAddButtonClick={onAddButtonClick}
            />
            <div className="d-flex justify-content-between">
                <div>
                    {/* Class name */}
                    <div style={{ color: "var(--color-dark-blue)" }}>
                        <Icon icon="id-card" className="me-2" />
                        {data?.class.className}
                    </div>
                    {/* Module code and name */}
                    <div
                        className="mb-2"
                        style={{ color: "var(--color-dark-blue)" }}
                    >
                        <Icon icon="cube" className="me-2" />
                        {`${data?.module.moduleCode} - ${data?.module.moduleName}`}
                    </div>
                </div>
                <div>
                    <Button
                        btn="secondary"
                        circle={true}
                        onClick={() => {
                            fetchReportData();
                        }}
                    >
                        <Icon icon="file-export"></Icon>
                    </Button>
                </div>
            </div>
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
                                    date={exam.examDay}
                                    duration={exam.durationInMinute}
                                    isCancelled={exam.isCancelled}
                                    examId={exam.examId}
                                    moduleId={data.module.moduleId}
                                    examName={exam.examName}
                                    key={exam.examId}
                                    classModuleId={param.classModuleId}
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

    function onClickViewResult(examId, classModuleId) {
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
                {/* Buttons */}
                <div className={styles.btn_container}>
                    <Button
                        onClick={() => {
                            onClickViewResult(examId, classModuleId);
                        }}
                        className="mr-2"
                        style={{ backgroundColor: "var(--color-dark-blue)" }}
                        {...(isCancelled && { disabled: true })}
                        {...(moment(date).isAfter(moment().toDate()) && {
                            disabled: true
                        })}
                    >
                        Result <Icon icon="arrow-right" className="ms-2" />
                    </Button>

                    <Button
                        onClick={() => {
                            onClickViewDetail(examId, classModuleId);
                        }}
                    >
                        Detail <Icon icon="arrow-right" className="ms-2" />
                    </Button>
                </div>
            </article>
        </div>
    );
};
