import Button from "components/Button";
import Icon from "components/Icon";
import Pagination from "components/Pagination";
import SearchBar from "components/SearchBar";
import Table from "components/Table";
import Wrapper from "components/Wrapper";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useLazyFetch } from "utilities/useFetch";
import { useWindowSize } from "utilities/useWindowSize";
import { API } from "utilities/constants";
import { useSelector } from "react-redux";
import moment from "moment";
import Loading from "pages/Loading";
import OurModal from "components/OurModal";
import useOutsideClick from "utilities/useOutsideClick";
import style from "styles/RequestAddQuestionBank.module.css";
const RequestAddQuestionBank = () => {
    const teacher = useSelector((store) => store.user);
    const size = useWindowSize();
    const [searchName, setSearchName] = useState("");
    const [currentPage, setcurrentPage] = useState(1);
    const pageSize = 5;
    const [currentRequest, setCurrentRequest] = useState();

    const modalRef = useRef(null);
    let { isClicked, setIsClicked } = useOutsideClick(modalRef);

    ///api/Question/requestList
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/Question/requestList?id=${teacher.accountId}&pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`
    );
    const columns = [
        "Requested by",
        "Module",
        "No. of questions",
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

    if (fetchResult.loading) return <Loading />;

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
                            onClick={() => {
                                setIsClicked(true);
                                setCurrentRequest(record);
                            }}
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Delete this account"
                        >
                            <Button
                                circle={true}
                                disabled={record.isAssigned}
                                btn="primary"
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
                    ></Icon>
                </header>
                <div className={style.bodyModal}>
                    <p>
                        Please choose a teacher to assign to review the question
                    </p>
                    <p>
                        <strong>Requested by:</strong>
                        {currentRequest?.fullname}
                    </p>
                    <p>
                        <strong>Module:</strong>
                        {currentRequest?.moduleName}
                    </p>
                    <p>
                        <strong>Banks:</strong>
                        {currentRequest?.isFinalExamBank
                            ? "Final Exam"
                            : "Progress Test"}
                    </p>
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
