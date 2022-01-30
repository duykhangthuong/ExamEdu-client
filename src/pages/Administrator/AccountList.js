import Table from "components/Table";
import SearchBar from "components/SearchBar";
import Wrapper from "components/Wrapper";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Icon from "components/Icon";
import { useLazyFetch } from "utilities/useFetch";
import Pagination from "components/Pagination";
import { API } from "utilities/constants";
import swal from "sweetalert2";
const AccountList = () => {
    const columns = [
        "ID",
        "Full name",
        "Role",
        "Email",
        "Created Day",
        "Action",
    ];
    const [deleteId, setDeleteId] = useState(0);
    const [deleteRole, setDeleteRole] = useState("");

    const [searchName, setSearchName] = useState("");
    const [currentPage, setcurrentPage] = useState(1);
    const pageSize = 5;
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/account/list?pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`
    );

    const [requestDelete, requestResult] = useLazyFetch(
        `${API}/account/${deleteId}/${deleteRole}`,
        {
            method: "delete",
            onCompleted: (data) => {
                if (data.status === 200) {
                    swal.fire({
                        titleText: "Account deleted",
                        icon: "success",
                        customClass: {
                            popup: "roundCorner",
                        },
                    });
                }
            },
            onError: (error) => {
                console.log(error);
                swal.fire({
                    titleText: "Operation failed!",
                    text: "The account hasn't been deleted.",
                    icon: "error",
                    customClass: {
                        popup: "roundCorner",
                    },
                });
            },
        }
    );

    //fetch data
    useEffect(() => {
        fetchData();
    }, [currentPage]);

    function handleSubmit() {
        fetchData();
    }
    useEffect(() => {
        if (deleteId !== 0) showModalDelete();
    }, [deleteId]);

    function showModalDelete() {
        console.log(`account to be deleted: ${deleteId} | ${deleteRole}`);
        swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this account?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e76565",
            cancelButtonColor: "#363940",
            confirmButtonText: "Confirm",
            customClass: {
                popup: "roundCorner",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                requestDelete();
                fetchData();
            }
            setDeleteId(0);
            setDeleteRole("");
        });
    }

    return (
        <Wrapper>
            <SearchBar
                pageName="Account List"
                onSubmit={handleSubmit}
                keyWord={searchName}
                setKeyWord={setSearchName}
                // filterValue={roleFilter}
                // setFilterValue={setRoleFilter}
                // filterOptions={[{value:}]}
                onAddButtonClick={true}
            />
            <Table
                columns={columns}
                data={fetchResult.data?.payload.map((record) => ({
                    id: record.id,
                    fullname: record.fullname,
                    role: record.roleID,
                    email: record.email,
                    createdAt: moment(record.createdAt).format(
                        "DD/MM/YYYY , h:mm A"
                    ),
                    action: (
                        <Icon
                            icon="trash-alt"
                            size="2x"
                            color="#e76565"
                            onClick={() => {
                                setDeleteId(record.id);
                                setDeleteRole(record.roleID);
                            }}
                        />
                    ),
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

export default AccountList;
