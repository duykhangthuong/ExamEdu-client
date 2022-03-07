import Pagination from "components/Pagination";
import Pill from "components/Pill";
import SearchBar from "components/SearchBar";
import Table from "components/Table";
import Wrapper from "components/Wrapper";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { API } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import moment from "moment";
import Loading from "pages/Loading";
const DeactivatedAccountList = () => {
    const columns = ["ID", "Full name", "Email", "Deleted Day", "Role"];
    //Lưu các giá trị tìm kiếm
    const [searchName, setSearchName] = useState("");
    //Lưu giá trị page hiện tại
    const [currentPage, setcurrentPage] = useState(1);
    //Lưu số lượng hàng trong 1 page
    const pageSize = 5;
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/Account/deactivatedList?pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`
    );
    //Gọi lại hàm Fetch khi nhập vô ô search
    function handleSubmit() {
        fetchData();
    }
    useEffect(() => {
        fetchData();
    }, [currentPage]);
    if (fetchResult.loading) {
        return <Loading />;
    }
    return (
        <Wrapper>
            <SearchBar
                pageName="Account History"
                onSubmit={handleSubmit}
                keyWord={searchName}
                setKeyWord={setSearchName}
                // filterValue={roleFilter}
                // setFilterValue={setRoleFilter}
                // filterOptions={[{value:}]}
            />
            <Table
                columns={columns}
                data={fetchResult.data?.payload.map((record) => ({
                    id: record.id,
                    fullname: record.fullname,
                    email: record.email,
                    createdAt: moment(record.createdAt).format(
                        "DD/MM/YYYY , h:mm A"
                    ),
                    role: (
                        <Pill
                            content={record.roleName}
                            type={record.roleName}
                        />
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

export default DeactivatedAccountList;
