import Table from "components/Table";
import SearchBar from "components/SearchBar";
import Pill from "components/Pill";
import Wrapper from "components/Wrapper";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Icon from "components/Icon";
import { useLazyFetch } from "utilities/useFetch";
import Pagination from "components/Pagination";
import { API } from "utilities/constants";
import swal from "sweetalert2";
import Button from "components/Button";
import { useWindowSize } from "utilities/useWindowSize";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const AccountList = () => {
    const history = useHistory();
    const size = useWindowSize();
    const columns = [
        "ID",
        "Full name",
        "Email",
        "Created Day",
        "Role",
        size.width > 768 ? "Action" : "",
    ];

    const [searchName, setSearchName] = useState("");
    const [currentPage, setcurrentPage] = useState(1);
    const pageSize = 5;
    const [fetchData, fetchResult] = useLazyFetch(
        `https://localhost:5001/api/Account/list?pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`
    );

    const [requestDelete, requestResult] = useLazyFetch("", {
        method: "delete",
        onCompletes: (data) => {
            swal.fire({
                titleText: "Account deleted",
                icon: "success",
                customClass: {
                    popup: "roundCorner",
                },
            });
            fetchData();
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
    });

    function handleSubmit() {
        fetchData();
    }

    function showModalDelete(deleteId, deleteRole) {
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
                requestDelete(
                    `https://localhost:5001/api/account/${deleteId}/${deleteRole}`
                );
            }
        });
    }
    //fetch data
    useEffect(() => {
        fetchData();
    }, [currentPage]);
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
                onAddButtonClick={() =>
                    history.push("/administrator/accounts/create")
                }
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
                    ),
                    action: (
                        <div
                            className="d-flex justify-content-center"
                            onClick={() => {
                                showModalDelete(record.id, record.roleID);
                            }}
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Delete this account"
                        >
                            <Button
                                circle={true}
                                disabled={requestResult.loading}
                                btn="alert-secondary"
                            >
                                <Icon
                                    icon="trash-alt"
                                    color="#e76565"
                                    className="fs-4"
                                />
                            </Button>
                        </div>
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
