import Button from "components/Button";
import Heading from "components/Heading";
import Icon from "components/Icon";
import Pagination from "components/Pagination";
import Pill from "components/Pill";
import SearchBar from "components/SearchBar";
import Table from "components/Table";
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
    const columns = [
        "Status",
        "Exam Name",
        "Module Code",
        "Exam Date",
        "Duration",
        "Room",
        "Password",
        "Supervisor",
        "Description",
        ""
    ];
    const pillStyle = {
        fontWeight: "bold",
        color: "darkblue",
        padding: "5%"
    };
    const [searchName, setSearchName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    //Get parameters from history
    // const param = useParams();
    const history = useHistory();

    const teacherId = useSelector((state) => state.user.accountId);
    //Fetching exams
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/Exam/examProctor/${teacherId}?pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`
    );

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    function handleSubmit() {
        fetchData();
    }

    function onClickInvigilate(examId) {
        history.push(`/invigilate/${examId}`);
    }

    if (fetchResult.loading) return <Loading />;

    return (
        <Wrapper>
            <SearchBar
                pageName={"Exam Proctor List"}
                onSubmit={handleSubmit}
                keyWord={searchName}
                setKeyWord={setSearchName}
                placeholder={"Search exam name or module code..."}
            />

            {/* Horizontal line */}
            <div className={`${styles.horizontal_line} mb-2 mb-md-3`}></div>

            {fetchResult.error?.status === 404 ? (
                <div className="d-flex justify-content-center">
                    <Heading size={2}>There are no exams yet</Heading>
                </div>
            ) : (
                <>
                    {/* Progress tests container */}
                    {/* <section className={styles.exam_card_container}> */}
                    {/* <ExamCard
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
                    /> */}
                    <Table
                        isVeryLong={true}
                        columns={columns}
                        data={fetchResult.data?.payload.map((exam) => ({
                            status: exam.isCancelled ? (
                                <Pill
                                    content="Cancelled"
                                    defaultColor="red"
                                    style={pillStyle}
                                />
                            ) : moment(exam.examDay).isSameOrAfter(
                                  moment().toDate()
                              ) ? (
                                <Pill
                                    content="Upcoming"
                                    defaultColor="yellow"
                                    style={pillStyle}
                                />
<<<<<<< HEAD
                            ) : moment(exam.examDay)
                                  .add(exam.durationInMinute, "minutes")
                                  .isSameOrAfter(moment().toDate()) ? (
                                <Pill
                                    content="In Progress"
                                    defaultColor="orange"
                                    style={pillStyle}
                                />
=======
>>>>>>> f08799eef7c78ef3e9706d608384e036d87c8afc
                            ) : (
                                <Pill
                                    content="Finished"
                                    defaultColor="green"
                                    style={pillStyle}
                                />
                            ),
                            examName: <b>{exam.examName}</b>,
                            moduleCode: exam.moduleCode,
                            examDate: moment(exam.examDay).format(
                                "DD/MM/YYYY , hh:mm A"
                            ),
                            duration: exam.durationInMinute,
                            room: exam.room,
                            password: exam.password,
                            supervisor: exam.supervisorEmail,
                            description: exam.description,
                            action: (
                                <div className={styles.btn_container}>
                                    {moment(exam.examDay)
                                        .add(exam.durationInMinute, "minutes")
                                        .isBefore(moment().toDate()) ||
                                    exam.isCancelled ? (
                                        <div />
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                onClickInvigilate(exam.examId);
                                            }}
                                            className="mr-2"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-blue)"
                                            }}
                                        >
                                            Start
                                            <Icon
                                                icon="arrow-right"
                                                className="ms-2"
                                            />
                                        </Button>
                                    )}
                                    {/* <Button
                                        onClick={() => {
                                            onClickInvigilate(exam.examId);
                                        }}
                                        className="mr-2"
                                        style={{
                                            backgroundColor: "#ff2d2d"
                                        }}
                                        {...(exam.isCancelled && {
                                            disabled: true
                                        })}
                                        {...(moment(exam.examDay)
                                            .add(
                                                exam.durationInMinute,
                                                "minutes"
                                            )
                                            .isBefore(moment().toDate()) && {
                                            disabled: true
                                        })}
                                    >
                                        Start
                                        <Icon
                                            icon="arrow-right"
                                            className="ms-2"
                                        />
                                    </Button> */}
                                </div>
                            )
                        }))}
                    />
                    {/* </section> */}
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

// const ExamCard = ({
//     examId,
//     examName,
//     moduleCode,
//     description,
//     room,
//     password,
//     date,
//     duration,
//     isFinalExam,
//     isCancelled,
//     supervisorEmail
// }) => {
//     const history = useHistory();

//     function onClickInvigilate(examId) {
//         history.push(`/invigilate/${examId}`);
//     }

//     return (
//         <div className={styles.exam_card_wrapper}>
//             <article className={styles.exam_card}>
//                 {/* Check icon */}
//                 {isCancelled ? (
//                     <Icon
//                         icon="times-circle"
//                         className={styles.times_icon}
//                         styles={{ color: "var(--color-orange)" }}
//                     />
//                 ) : moment(date).isAfter(moment().toDate()) ? (
//                     <Icon icon="clock" className={styles.clock_icon} />
//                 ) : (
//                     <Icon icon="check-circle" className={styles.check_icon} />
//                 )}

//                 {/* Progress test */}
//                 <div className="d-flex flex-column justify-content-center align-items-center text-center">
//                     <Heading size="3" className="mb-3">
//                         {examName}
//                     </Heading>
//                     {/* Module code */}
//                     <div className="mb-3">
//                         <Icon
//                             icon="cube"
//                             className="me-2"
//                             aria-hidden="true"
//                             title="Exam module"
//                         />
//                         {moduleCode}
//                     </div>
//                     {/* Date time */}
//                     <div className="mb-3">
//                         <Icon
//                             icon="calendar-alt"
//                             className="me-2"
//                             aria-hidden="true"
//                             title="Exam date"
//                         />
//                         {moment(date).format("DD/MM/yyyy")}
//                     </div>
//                     {/* Duration */}
//                     <div className="mb-3">
//                         <Icon
//                             icon="forward"
//                             className="me-2"
//                             aria-hidden="true"
//                             title="Duration"
//                         />
//                         {`${duration} minutes`}
//                     </div>
//                     {/* Room */}
//                     <div className="mb-3">
//                         <Icon
//                             icon="users"
//                             className="me-2"
//                             aria-hidden="true"
//                             title="Room"
//                         />
//                         {room}
//                     </div>
//                     {/* Password */}
//                     <div className="mb-3">
//                         <Icon
//                             icon="key"
//                             className="me-2"
//                             aria-hidden="true"
//                             title="Password"
//                         />
//                         {password ? (
//                             password
//                         ) : (
//                             <span style={{ fontStyle: "italic" }}>
//                                 No password
//                             </span>
//                         )}
//                     </div>
//                     {/* Supervisor */}
//                     <div className="mb-3">
//                         <Icon
//                             icon="address-card"
//                             className="me-2"
//                             aria-hidden="true"
//                             title="Supervisor contact"
//                         />
//                         {supervisorEmail}
//                     </div>
//                     {/* Description */}
//                     <div className="mb-3">
//                         <Icon
//                             icon="pen"
//                             className="me-2"
//                             aria-hidden="true"
//                             title="Description"
//                         />
//                         {description ? (
//                             description
//                         ) : (
//                             <span style={{ fontStyle: "italic" }}>
//                                 No description
//                             </span>
//                         )}
//                     </div>
//                 </div>
//                 {/* Buttons */}
//                 <div className={styles.btn_container}>
//                     <Button
//                         onClick={() => {
//                             onClickInvigilate(examId);
//                         }}
//                         className="mr-2"
//                         style={{ backgroundColor: "#8b0000" }}
//                         {...(isCancelled && { disabled: true })}
//                         {...(moment(date).isAfter(moment().toDate()) && {
//                             disabled: true
//                         })}
//                     >
//                         Start <Icon icon="arrow-right" className="ms-2" />
//                     </Button>
//                 </div>
//             </article>
//         </div>
//     );
// };
