import SearchBar from "components/SearchBar";
import Wrapper from "components/Wrapper";
import React from "react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { API, REGEX, FLOATNUMBER } from "utilities/constants";
import { useParams } from "react-router-dom";
import { useLazyFetch, useFetch } from "utilities/useFetch";
import { useWindowSize } from "utilities/useWindowSize";
import useOutsideClick from "utilities/useOutsideClick";
import { useForm } from "utilities/useForm";
import Icon from "components/Icon";
import styles from "styles/ExamResult.module.css";
import styleTA from "../../styles/TextAnswer.module.css";
import Table from "components/Table";
import moment from "moment";
import Button from "components/Button";
import Loading from "pages/Loading";
import Heading from "components/Heading";
import InputBox from "components/InputBox";
import OurModal from "components/OurModal";
import Swal from "sweetalert2";
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
        size.width > 768 ? "Grade" : ""
    ];

    const [studentId, setStudentId] = useState();
    const [studentEmail, setStudentEmail] = useState();
    const [studentName, setStudentName] = useState("");
    const [examQuestionId, setExamQuestionId] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [currentPage, setcurrentPage] = useState(1);
    const pageSize = 5;

    //Fetch API for the table of the exam result
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/exam/result/${param.ExamID}?pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`
    );

    // Fetch classModule info
    const { data, loading, error } = useFetch(
        `${API}/ClassModule/${param.classModuleId}`
    );
    const [fetchNotifcation, fetchNotifcationResult] = useLazyFetch("");

    //Fetch report data to download report file
    const [fetchReportData, fetchReportDataResult] = useLazyFetch(
        `${API}/exam/result/report/${param.ExamID}/${param.classModuleId}`,
        {
            method: "get",
            responseType: "blob",
            //Oncompleted -> download file
            onCompletes: (dataStream) => {
                const fileURL = URL.createObjectURL(dataStream);

                const anchor = document.createElement("a");
                anchor.href = fileURL;
                anchor.download = `Report_${data?.class.className}_${data?.module.moduleCode}_${fetchResult.data?.payload[0].examName}`;
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
    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const [fetchDataTA, fetchDataResultTA] = useLazyFetch("");
    const [postScore, postScoreResult] = useLazyFetch("");
    const fields = useRef({});
    //use to set field for form base on number of element when fetch API
    useEffect(() => {
        for (let i = 0; i < fetchDataResultTA.data?.length; i++) {
            let a = `textAnswerScore${i}`;
            fields.current = {
                ...fields.current,
                [a]: {
                    validate: REGEX,
                    regex: FLOATNUMBER,
                    message: "Score must be float number"
                }
            };
        }
        //set array of examQuestionId when fetch API for student text answer, to set to input later (line 87)
        setExamQuestionId(fetchDataResultTA.data?.map((a) => a.examQuestionId));
    }, [fetchDataResultTA.loading]);

    const updateScore = useForm(fields.current, handleUpdateScore);
    var fieldProp = Object.getOwnPropertyNames(fields.current); //get array of property name of fields (textAnswerScore0, testAnswerScore1... )
    // create input to post API
    const input = fieldProp.map((f, index) => {
        return {
            mark: parseFloat(updateScore.values[f]),
            examQuestionId: examQuestionId[index]
        };
    });
    //Call API to post mark
    function handleUpdateScore() {
        postScore(
            `${API}/Mark/textAnswer?studentId=${studentId}&examId=${param.ExamID}`,
            {
                method: "PUT",
                body: input,
                onCompletes: () => {
                    Swal.fire(
                        "Success",
                        "Grade text answer successfully",
                        "success"
                    );
                    fetchNotifcation(`${API}/notify/trainee`, {
                        method: "POST",
                        body: {
                            sendTo: studentEmail,
                            user: "Notification",
                            message: `Your text answer in ${fetchResult.data?.payload[0].examName} have been grade`
                        }
                    });
                    fetchData();
                },
                onError: (error) => {
                    Swal.fire("Error", error.message, "error");
                }
            }
        );
    }
    const modalRef = useRef(null);
    let { isClicked, setIsClicked } = useOutsideClick(modalRef);

    //Check if the page is loaded and if there is any data record
    if (fetchResult.loading || fetchReportDataResult.loading)
        return <Loading />;
    if (fetchResult.error?.status === 404) {
        return (
            <Wrapper className="d-flex justify-content-center align-items-center">
                <div className={styles.notification_box}>
                    <Heading size="3">This exam has no result yet!!!</Heading>
                </div>
            </Wrapper>
        );
    }
    //Check if TextAnswer is loading, return modal show isLoading
    if (fetchDataResultTA.loading || postScoreResult.loading) {
        return (
            <OurModal
                modalRef={modalRef}
                isClicked={true}
                setIsClicked={setIsClicked}
                modalClassName={`${styleTA.modal}`}
            >
                <header
                    className={`${styleTA.heading} d-flex justify-content-between`}
                >
                    <b>Grade Text Question</b>
                    {/* X icon to close */}
                    <Icon
                        icon="times"
                        className="me-2 fs-3"
                        onClick={() => setIsClicked(false)}
                    ></Icon>
                </header>
                <Loading />
            </OurModal>
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
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-md-row">
                    <div className="d-flex flex-md-column me-5">
                        {/* Class name */}
                        <div
                            className="mb-2"
                            style={{ color: "var(--color-dark-blue)" }}
                        >
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
                            {`${moment(
                                fetchResult.data?.payload[0].examDay
                            ).format("DD/MM/YYYY, h:mm A")}`}
                        </div>
                    </div>
                </div>
                <div className="">
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

            <Table
                columns={columns}
                data={fetchResult.data?.payload.map((item) => ({
                    id: item.studentId,
                    fullName: item.studentName,
                    timeSpent:
                        item.finishedAt !== null
                            ? moment(item.finishedAt).diff(
                                  item.examDay,
                                  "minutes"
                              ) + " minutes"
                            : "Not finished yet",
                    submittedTime:
                        item.finishedAt !== null
                            ? moment(item.finishedAt).format(
                                  "DD/MM/YYYY, h:mm A"
                              )
                            : "Not finished yet",
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
                        //Nút chấm điểm tự luận, onClick sẽ trả về studentId vào State ở dòng 37
                        <div
                            className="d-flex justify-content-center"
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
                                onClick={() => {
                                    setStudentName(item.studentName);
                                    setStudentId(item.studentId);
                                    setStudentEmail(item.studentEmail);
                                    setIsClicked(true);
                                    fetchDataTA(
                                        `${API}/Answer/TextAnswer?studentId=${item.studentId}&examId=${param.ExamID}`
                                    );
                                }}
                            >
                                <Icon
                                    icon="pencil-ruler"
                                    color="#fff"
                                    className="fs-4"
                                />
                            </Button>
                        </div>
                    )
                }))}
            />
            {/* Modal show text answer */}
            <OurModal
                modalRef={modalRef}
                isClicked={isClicked}
                setIsClicked={setIsClicked}
                modalClassName={`${styleTA.modal}`}
            >
                {/* Header */}
                <header
                    className={`${styleTA.heading} d-flex justify-content-between`}
                >
                    <b>Grade Text Question</b>
                    {/* X icon to close */}
                    <Icon
                        icon="times"
                        className="me-2 fs-3"
                        onClick={() => setIsClicked(false)}
                    ></Icon>
                </header>
                <div className="text-center mt-2">
                    Student Name: {studentName}
                </div>
                <form onSubmit={updateScore.onSubmit}>
                    <div className={`${styleTA.questionWrapper}`}>
                        {fetchDataResultTA.data?.map((ans, index) => {
                            return (
                                // A block include question content, text answer and input score
                                <div
                                    className={`${styleTA.questionItem}`}
                                    key={index}
                                >
                                    {ans.questionContent}
                                    <div className={`${styleTA.studentAnswer}`}>
                                        {ans.studentAnswer}
                                    </div>
                                    <div>
                                        <i>
                                            Max score for this quesition is{" "}
                                            <b>{ans.questionMark.toFixed(2)}</b>
                                        </i>
                                        <InputBox
                                            label="Score"
                                            name={`textAnswerScore${index}`}
                                            value={
                                                updateScore.values[
                                                    `textAnswerScore${index}`
                                                ] || ""
                                            }
                                            onChange={updateScore.onChange}
                                            errorMessage={
                                                updateScore.errors[
                                                    `textAnswerScore${index}`
                                                ]
                                            }
                                            className={`mb-3 mb-md-2 ${styleTA.input_box}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Submit button */}
                    <div className="d-flex justify-content-center align-items-center mt-2">
                        <button
                            type="submit"
                            className={`btn ${styleTA.btn_submit}`}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </OurModal>
        </Wrapper>
    );
};

export default ExamResult;
