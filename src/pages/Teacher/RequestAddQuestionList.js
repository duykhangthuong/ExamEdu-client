import Pagination from "components/Pagination";
import SearchBar from "components/SearchBar";
import Wrapper from "components/Wrapper";
import Loading from "pages/Loading";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useLazyFetch } from "utilities/useFetch";
import { useWindowSize } from "utilities/useWindowSize";
import { API } from "utilities/constants";
import Button from "components/Button";
import Icon from "components/Icon";
import Table from "components/Table";
import moment from "moment";

const RequestAddQuestionList = () => {
    const history = useHistory();
    //Lưu các giá trị tìm kiếm
    const [searchName, setSearchName] = useState("");
    //Lưu giá trị page hiện tại
    const [currentPage, setcurrentPage] = useState(1);
    //Lưu số lượng hàng trong 1 page
    const pageSize = 5;
    const user = useSelector((state) => state.user.accountId);
    const size = useWindowSize();

    //Các cột trong bảng
    const columns = [
        "Requested by",
        "Module",
        "No. of questions",
        "Requested time",
        size.width > 768 ? "Detail" : ""
    ];

    //Fetch data của cái bảng
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/Question/requestList/${user}?pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`,{
            onCompletes:(data) => {console.log(data);}
        }
    );
    //data loading error
    useEffect(() => {
        fetchData();
    }, [currentPage]);

    function handleSubmit() {
        fetchData();
    }

    if (fetchResult.loading) return <Loading />;
    return (
        <Wrapper>
            <SearchBar
                pageName="Request add question list"
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
                    requestedTime:  moment(record.createdAt).format(
                        "DD/MM/YYYY , h:mm A"
                    ),
                    detail: (
                        <div
                            className="d-flex justify-content-center"
                            onClick={() => {
                                history.push(
                                    `/teacher/question/process/${record.addQuestionRequestId}`
                                );
                            }}
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="View this request"
                        >
                            <Button
                                circle={true}
                                disabled={fetchResult.loading}
                                btn="primary"
                            >
                                <Icon
                                    icon="arrow-right"
                                    color="#fff"
                                    className="fs-4"
                                />
                            </Button>
                        </div>
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

export default RequestAddQuestionList;
