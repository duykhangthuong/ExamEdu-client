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

const ExamList = () => {
    const columns = ["Exam name", "Exam date", "Module"];
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
                    history.push("/teacher/exam/create/info");
                }}
                placeholder="Search by exam name or module code"
            />
            <Table
                columns={columns}
                data={fetchResult.data?.payload.map((exam) => ({
                    examName: exam.examName,
                    examDate: moment(exam.examDay).format("HH:MM DD/MM/YYYY"),
                    module:
                        exam.module.moduleCode + " - " + exam.module.moduleName
                }))}
                isSelectable={true}
                onClick={(index) => {
                    history.push(
                        `/AcademicDepartment/exam/${fetchResult.data?.payload[index].examId}`
                    );
                }}
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
