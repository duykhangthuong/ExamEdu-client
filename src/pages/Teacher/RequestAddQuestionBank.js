import Button from "components/Button";
import Icon from "components/Icon";
import Pagination from "components/Pagination";
import SearchBar from "components/SearchBar";
import Table from "components/Table";
import Wrapper from "components/Wrapper";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useLazyFetch, useFetch } from "utilities/useFetch";
import { useWindowSize } from "utilities/useWindowSize";
import { API } from "utilities/constants";
import { useSelector } from "react-redux";
import moment from "moment";
import Loading from "pages/Loading";
import OurModal from "components/OurModal";
import useOutsideClick from "utilities/useOutsideClick";
import style from "styles/RequestAddQuestionBank.module.css";
import swal from "sweetalert2";
const RequestAddQuestionBank = () => {
    const teacher = useSelector((store) => store.user);
    const size = useWindowSize();
    const [searchName, setSearchName] = useState("");
    const [currentPage, setcurrentPage] = useState(1);
    const [selectedTeacherId, setSelectedTeacherId] = useState();
    const pageSize = 5;
    const [currentRequest, setCurrentRequest] = useState();

    const modalRef = useRef(null);
    let { isClicked, setIsClicked } = useOutsideClick(modalRef);

    const { data1, loading1, error1 } = useFetch(
        `${API}/Teacher/check/${teacher.accountId}`
    );

    ///api/Question/requestList
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/Question/requestList?id=${teacher.accountId}&pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`
    );

    //hàm assign
    const [requestAssign, requestResult] = useLazyFetch("", {
        method: "put",
        //Khi fetch xong, status code  == 200
        onCompletes: (data) => {
            swal.fire({
                titleText: "Assigned successfully!",
                icon: "success",
                customClass: {
                    popup: "roundCorner"
                }
            }).then((result) => {
                //nếu người dùng nhấn OK
                if (result.isConfirmed) {
                    setSelectedTeacherId();
                    fetchData();
                    setIsClicked(false);
                }
            });
        },
        //Khi fetch ko được
        onError: (error) => {
            swal.fire({
                titleText: "Operation failed!",
                text: "There is an error when assigning request to teacher",
                icon: "error",
                customClass: {
                    popup: "roundCorner"
                }
            });
        }
    });

    ///api/Teacher/idName - Get name of all teacher
    const { data, loading, error } = useFetch(`${API}/Teacher/idName`);

    const columns = [
        "Requested by",
        "Module",
        "No. questions",
        "Requested time",
        "Status",
        size.width > 768 ? "Assign" : ""
    ];

    function handleSubmit() {
        fetchData();
    }

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    if (fetchResult.loading || requestResult.loading) return <Loading />;
    function showModalAsign(id, addQuestionRequestId, teacherId) {
        swal.fire({
            title: "Are you sure?",
            text: "Are you sure to assign this request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e76565",
            cancelButtonColor: "#363940",
            confirmButtonText: "Confirm",
            customClass: {
                popup: "roundCorner"
            }
        }).then((result) => {
            //nếu người dùng nhấn OK
            if (result.isConfirmed) {
                requestAssign(
                    `${API}/Question/assignTeacher/?id=${id}&addQuestionRequestId=${addQuestionRequestId}&teacherId=${teacherId}`
                );
            }
        });
    }
    //Check if teacher is a head of department
    if (fetchResult.error !== undefined && fetchResult.error.status == 404)
        return (
            <Wrapper className="text-center">
                <h4 className="fw-bold">
                    You need permission to use this feature
                </h4>
                <h5>
                    Please use a Head of Department account to access this
                    feature
                </h5>
            </Wrapper>
        );
    return (
        <Wrapper>
            <SearchBar
                pageName="Request add question bank"
                onSubmit={handleSubmit}
                keyWord={searchName}
                setKeyWord={setSearchName}
            />

            <Table
                columns={columns}
                data={fetchResult.data?.payload.map((record) => ({
                    requestedBy: record.fullname,
                    module: record.moduleName,
                    noOfQuestions: record.numberOfQuestion,
                    requestedTime: moment(record.createdAt).format(
                        "DD/MM/YYYY , h:mm A"
                    ),
                    status: record.isAssigned ? "Assigned" : "Pending",
                    assign: (
                        <div
                            className="d-flex justify-content-center"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Assign this request"
                        >
                            <Button
                                circle={true}
                                disabled={record.isAssigned}
                                btn="primary"
                                onClick={() => {
                                    setIsClicked(true);
                                    setCurrentRequest(record);
                                }}
                            >
                                <Icon
                                    icon="user"
                                    color="#fff"
                                    className="fs-4"
                                />
                            </Button>
                        </div>
                    )
                }))}
            />
            <OurModal
                modalRef={modalRef}
                isClicked={isClicked}
                setIsClicked={setIsClicked}
                // modalClassName={`${styleTA.modal}`}
            >
                <header
                    className={`${style.heading} d-flex justify-content-between`}
                >
                    <b></b>
                    {/* X icon to close */}
                    <Icon
                        icon="times"
                        className="me-2 fs-3"
                        onClick={() => setIsClicked(false)}
                        style={{ cursor: "pointer" }}
                    ></Icon>
                </header>
                <div className={style.bodyModal}>
                    <p>
                        Please choose a teacher to assign to review the question
                    </p>
                    <p>
                        <strong>Requested by: </strong>
                        {currentRequest?.fullname}
                    </p>
                    <p>
                        <strong>Module: </strong>
                        {currentRequest?.moduleName}
                    </p>
                    <p>
                        <strong>Banks: </strong>
                        {currentRequest?.isFinalExamBank
                            ? "Final Exam"
                            : "Progress Test"}
                    </p>

                    <div className="d-flex pb-3 mb-3">
                        <select
                            className={style.input_select}
                            onChange={(e) => {
                                if (e.target.value !== "-1") {
                                    setSelectedTeacherId(
                                        parseInt(e.target.value)
                                    );
                                } else {
                                    setSelectedTeacherId();
                                }
                            }}
                        >
                            <option value={"-1"} style={{ cursor: "pointer" }}>
                                Select Teacher
                            </option>
                            {data?.map((teacher, index) => {
                                return (
                                    <option
                                        value={teacher.teacherId}
                                        key={index}
                                    >
                                        {teacher.fullname}
                                    </option>
                                );
                            })}
                        </select>
                        <Button
                            onClick={() => {
                                showModalAsign(
                                    teacher.accountId,
                                    currentRequest.addQuestionRequestId,
                                    selectedTeacherId
                                );
                            }}
                            className="ms-3"
                            disabled={requestResult.loading}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </OurModal>
            <Pagination
                totalRecords={fetchResult.data?.totalRecords}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setcurrentPage}
            />
        </Wrapper>
    );
};

export default RequestAddQuestionBank;
