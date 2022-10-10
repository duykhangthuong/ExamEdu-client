import SearchBar from "components/SearchBar";
import Table from "components/Table";
import Wrapper from "components/Wrapper";
import Loading from "pages/Loading";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { API } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import moment from "moment";
import Pagination from "components/Pagination";
import styles from "../../styles/ClassModuleStudent.module.css";
import Icon from "components/Icon";

const ExamList = () => {
    const columns = ["Exam name", "Exam date", "Module", "Action"];
    //Lưu các giá trị tìm kiếm
    const [searchName, setSearchName] = useState("");
    //Lưu giá trị page hiện tại
    const [currentPage, setcurrentPage] = useState(1);
    //Lưu số lượng hàng trong 1 page
    const pageSize = 5;

    const history = useHistory();

    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/exam/all/?pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`
    );
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
                pageName={"Exam List"}
                onSubmit={handleSubmit}
                keyWord={searchName}
                setKeyWord={setSearchName}
                onAddButtonClick={() => {
                    history.push("/AcademicDepartment/exam/create/info");
                }}
                placeholder="Search by exam name or module code"
            />
            <Table
                columns={columns}
                data={fetchResult.data?.payload.map((exam) => ({
                    examName: exam.examName,
                    examDate: moment(exam.examDay).format("HH:MM DD/MM/YYYY"),
                    module:
                        exam.module.moduleCode + " - " + exam.module.moduleName,
                    action: (
                        <span className="d-flex justify-content-center">
                            <button
                                className={styles.buttonConfirmAddStudent}
                                onClick={() => {
                                    history.push(
                                        `/AcademicDepartment/exam/${exam.examId}`
                                    );
                                }}
                                style={{
                                    paddingBottom: "0.2rem",
                                    paddingTop: "0.2rem"
                                }}
                            >
                                Detail
                                <Icon
                                    icon="angle-double-right"
                                    className="ms-1"
                                />
                            </button>
                        </span>
                    )
                }))}
            />

            <Pagination
                totalRecords={fetchResult.data?.totalRecords}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setcurrentPage}
            />
        </Wrapper>
    );
};

export default ExamList;
